import express from "express";
import { nanoid } from "nanoid";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());

const urlDatabase = {};

app.post("/shorten", (req, res) => {
  const { url } = req.body;
  const shortCode = nanoid(6);
  const shortUrl = `${(
    process.env.BASE_URL || "https://linkfly.vercel.app/"
  ).replace(/\/+$/, "")}/${shortCode}`;

  urlDatabase[shortCode] = url;
  res.json({ shortenedUrl: shortUrl });
});

app.get("/:shortCode", (req, res) => {
  const { shortCode } = req.params;
  const originalUrl = urlDatabase[shortCode];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send("Link não encontrado");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
