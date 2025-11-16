const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://ankitkr1841:Ankit1841@cluster0.sch6n5t.mongodb.net/notesdb?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("MongoDB Atlas Connected 🚀");
    console.log("Server is ready to accept requests!");
  })
  .catch((err) => {
    console.log("MongoDB Error ❌", err.message);
    console.log("\n⚠️  Authentication failed! Please check:");
    console.log("1. Your MongoDB Atlas username and password");
    console.log("2. Your IP address is whitelisted in MongoDB Atlas");
    console.log("3. Update the MONGODB_URI in .env file with correct credentials");
    console.log("\nServer will continue running but database operations will fail.");
  });

const NoteSchema = new mongoose.Schema({
  title: String,
  details: String,
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", NoteSchema);

// Health check endpoint (doesn't require MongoDB)
app.get("/", (req, res) => {
  res.json({ 
    status: "Server is running! ✅",
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Not connected"
  });
});

// ADD NOTE API
app.post("/addnote", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        msg: "Database not connected", 
        error: "MongoDB connection is not established. Please check your connection string and network settings." 
      });
    }
    const { title, details } = req.body;
    const newNote = new Note({ title, details });
    await newNote.save();

    res.json({ msg: "Note Saved", newNote });
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ msg: "Error saving note", error: error.message });
  }
});

// GET NOTES API
app.get("/notes", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        msg: "Database not connected", 
        error: "MongoDB connection is not established. Please check your connection string and network settings." 
      });
    }
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ msg: "Error loading notes", error: error.message });
  }
});

// DELETE NOTE API
app.delete("/notes/:id", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        msg: "Database not connected", 
        error: "MongoDB connection is not established. Please check your connection string and network settings." 
      });
    }
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid note ID" });
    }
    
    const deletedNote = await Note.findByIdAndDelete(id);
    
    if (!deletedNote) {
      return res.status(404).json({ msg: "Note not found" });
    }
    
    res.json({ msg: "Note deleted successfully", deletedNote });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ msg: "Error deleting note", error: error.message });
  }
});

// SERVER START
app.listen(5000, () => {
  console.log("═══════════════════════════════════════");
  console.log("🚀 Server running on port 5000");
  console.log("📍 Health check: http://localhost:5000/");
  console.log("📍 API endpoint: http://localhost:5000/notes");
  console.log("═══════════════════════════════════════");
});
