const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---- MONGODB SETUP ----
const s =
  "mongodb://dad:00dad00@ac-dwfstm1-shard-00-00.v2m9wr2.mongodb.net:27017,ac-dwfstm1-shard-00-01.v2m9wr2.mongodb.net:27017,ac-dwfstm1-shard-00-02.v2m9wr2.mongodb.net:27017/data?ssl=true&replicaSet=atlas-qg6kg7-shard-0&authSource=admin&retryWrites=true&w=majority&appName=mrdb";

mongoose
  .connect(s)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ---- SCHEMA ----
const textSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const TextModel = mongoose.model("Text", textSchema);

// ---- ROUTES ----
app.post("/api/text", async (req, res) => {
  try {
    const { content } = req.body;

    // Example processing
    const processed = content.trim().toLowerCase();

    const newText = new TextModel({ content: processed });
    await newText.save();

    res.json({ message: "Saved successfully!", data: processed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

app.get("/api/text", async (req, res) => {
  try {
    const messages = await TextModel.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages." });
  }
});

// ---- START SERVER ----
app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);
