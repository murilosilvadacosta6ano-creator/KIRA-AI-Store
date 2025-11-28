import express from "express";
import gplay from "google-play-scraper";
import cors from "cors";

const app = express();
app.use(cors());

// 🎮 1. List Free Games with Pagination support for Infinite Scroll
app.get("/api/jogos", async (req, res) => {
  try {
    // Pagination logic to support infinite scroll
    const page = parseInt(req.query.page) || 1;
    const limit = 20; 
    const start = (page - 1) * limit;

    const jogos = await gplay.list({
      collection: gplay.collection.TOP_FREE_GAMES,
      num: limit,
      start: start
    });
    res.json(jogos);
  } catch (error) {
    console.error("Scraper Error:", error);
    res.status(500).json({ error: "Erro ao buscar jogos." });
  }
});

// 🔍 2. Search apps/games by name
app.get("/api/buscar", async (req, res) => {
  const term = req.query.q;
  if (!term) return res.json([]);

  try {
    const results = await gplay.search({
      term,
      num: 20,
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar app." });
  }
});

// 📄 3. Specific app details
app.get("/api/app/:id", async (req, res) => {
  try {
    const detalhes = await gplay.app({
      appId: req.params.id,
    });
    res.json(detalhes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar detalhes." });
  }
});

// 🚀 Start server
app.listen(3000, () => {
  console.log("API Server running at http://localhost:3000");
});