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

// ---- SCHEMA ----
const textSchema = new mongoose.Schema({
  name: String,
  address: String,
  region: String,
  mobile: String,
  speciality: String,
  createdAt: { type: Date, default: Date.now },
});

const TextModel = mongoose.model("Text", textSchema);

// ---- ROUTES ----
app.post("/api/text", async (req, res) => {
  try {
    const { name, address, region, mobile, speciality } = req.body;
    const newEntry = new TextModel({
      name,
      address,
      region,
      mobile,
      speciality,
    });
    await newEntry.save();
    res.json({ message: "Saved successfully!" });
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
    res.status(500).json({ message: error.message }); // something went wrong
  }
});

app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// Start server
mongoose
  .connect(s)
  .then(() => {
    // Start the server
    app.listen(5000, () => {
      console.log(`Server is running on port ${5000}`);
    });
  })
  .catch((err) => console.log(err));

app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err);
  res.status(500).json({ message: "Server crashed", error: err.message });
});

module.exports = app;
