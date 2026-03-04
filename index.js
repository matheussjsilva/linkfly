import express from "express";
import { nanoid } from "nanoid";
import path from "path";
import dotenv from "dotenv";
import compression from "compression";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.json());

// The Express backend acts purely as an API now.
// The frontend UI is handled by Vite (React) during development.

const urlDatabase = {};

app.post("/shorten", (req, res) => {
  const { url, domain } = req.body;
  const shortCode = nanoid(6);
  
  // The ultimate fix: The React frontend now explicitly tells us where it's running 
  // (e.g., http://localhost:5173). We trust the client's `domain` payload for generating the link.
  let baseUrl = domain 
    ? domain.replace(/\/+$/, "") 
    : process.env.BASE_URL 
      ? process.env.BASE_URL.replace(/\/+$/, "")
      : `http://${req.headers.host}`;

  const shortUrl = `${baseUrl}/${shortCode}`;

  urlDatabase[shortCode] = url;
  res.json({ shortenedUrl: shortUrl });
});

// Specific GET request for shortening redirection
app.get("/:shortCode", (req, res) => {
  const { shortCode } = req.params;
  
  // Ignore common frontend or root requests that shouldn't be treated as a shortcode
  if (!shortCode || shortCode === 'favicon.ico' || shortCode.includes('.')) {
    return res.status(404).send("Not a valid shortcode route");
  }

  const originalUrl = urlDatabase[shortCode];
  if (originalUrl) {
    return res.redirect(originalUrl);
  } else {
    // Return a JSON error or text saying link not found
    return res.status(404).send("Link não encontrado ou expirou.");
  }
});

app.get("/sitemap.xml", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "sitemap.xml"));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
