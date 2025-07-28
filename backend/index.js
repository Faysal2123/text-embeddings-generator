const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const { pipeline } = require("@xenova/transformers");

const app = express();
app.use(cors());
app.use(express.json());

let extractor;

// Load model
async function loadModel() {
  console.log("Loading model...");
  extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
  console.log(" Model loaded successfully!");
}

// Generate embeddings
async function getEmbedding(text) {
  if (!extractor) throw new Error("Model is not loaded.");

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
}

// API Endpoint
app.get("/embeddings", async (req, res) => {
  try {
    const data = await fs.readFile("./input.txt", "utf-8");
    const paragraphs = data
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const embeddings = await Promise.all(
      paragraphs.map(async (para) => {
        const embedding = await getEmbedding(para);
        return { paragraph: para, embedding };
      })
    );

    res.json({ embeddings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

const PORT = 4000;
app.listen(PORT, async () => {
  await loadModel();
  console.log(`Backend running at http://localhost:${PORT}`);
});
