import express from "express";
import { nanoid } from "nanoid";
import path from "path";
import dotenv from "dotenv";
import compression from "compression";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.json());

// Initialize Supabase Client using environment credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using Service Role Key to bypass RLS in the backend

if (!supabaseUrl || !supabaseKey) {
  console.error("FATAL: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'linkfly' }
});

app.post("/shorten", async (req, res) => {
  const { url, domain } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: "A URL original é obrigatória." });
  }

  const shortCode = nanoid(6);
  
  // The React frontend explicitly tells us where it's running (e.g., http://localhost:5173). 
  let baseUrl = domain 
    ? domain.replace(/\/+$/, "") 
    : process.env.BASE_URL 
      ? process.env.BASE_URL.replace(/\/+$/, "")
      : `http://${req.headers.host}`;

  const shortUrl = `${baseUrl}/${shortCode}`;

  try {
    // Persist into Supabase PostgreSQL (custom schema 'linkfly' explicitly set in createClient)
    const { error } = await supabase
      .from('links')
      .insert([
        { original_url: url, short_code: shortCode }
      ]);

    if (error) {
        throw new Error(error.message);
    }

    res.json({ shortenedUrl: shortUrl });
  } catch (dbError) {
    console.error("Database Insert Error:", dbError);
    res.status(500).json({ error: "Erro interno ao salvar no banco de dados." });
  }
});

// Specific GET request for shortening redirection
app.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;
  
  // Ignore common frontend or root requests that shouldn't be treated as a shortcode
  if (!shortCode || shortCode === 'favicon.ico' || shortCode.includes('.')) {
    return res.status(404).send("Not a valid shortcode route");
  }

  try {
    // Fetch original URL from database
    const { data, error } = await supabase
      .from('links')
      .select('original_url')
      .eq('short_code', shortCode)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return res.status(404).send("Link não encontrado ou inativado.");
    }

    // Redirect user to the recovered destination
    return res.redirect(data.original_url);
  } catch (redirectError) {
    console.error("Database Select Error:", redirectError);
    return res.status(500).send("Erro do servidor ao redirecionar.");
  }
});

app.get("/sitemap.xml", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "sitemap.xml"));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
