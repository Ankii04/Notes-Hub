import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const router = express.Router();

// CORS
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// MongoDB Connection (Cached for Serverless)
let isConnected = false; // Track connection status

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error", err.message);
    throw err; // Re-throw to be handled by the route
  }
};

// Schema
const NoteSchema = new mongoose.Schema({
  title: String,
  details: String,
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

// Routes
router.get("/", async (req, res) => {
  await connectDB();
  res.json({
    status: "API working",
    mongodb: isConnected === 1 ? "Connected" : "Not connected",
  });
});

router.post("/addnote", async (req, res) => {
  try {
    await connectDB();
    const { title, details } = req.body;
    const newNote = new Note({ title, details });
    await newNote.save();
    res.json({ msg: "Note Saved", newNote });
  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
});

router.get("/notes", async (req, res) => {
  try {
    await connectDB();
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
});

router.delete("/notes/:id", async (req, res) => {
  try {
    await connectDB();
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted", deletedNote });
  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
});

// Mount Router
app.use("/api", router);

// Fallback for root path
app.get("/", (req, res) => {
  res.json({ status: "API Root" });
});

export default app;
