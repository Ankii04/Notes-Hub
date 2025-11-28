const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error", err.message));

// Schema
const NoteSchema = new mongoose.Schema({
  title: String,
  details: String,
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", NoteSchema);

// Routes
app.get("/", (req, res) => {
  res.json({
    status: "API working",
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Not connected",
  });
});

app.post("/addnote", async (req, res) => {
  try {
    const { title, details } = req.body;
    const newNote = new Note({ title, details });
    await newNote.save();
    res.json({ msg: "Note Saved", newNote });
  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
});

app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted", deletedNote });
  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
});

// Required for Vercel Serverless Functions
module.exports = (req, res) => app(req, res);
