const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS configuration - allow requests from Vercel and localhost
const allowedOrigins = [
  'http://localhost:5173',
  'https://notes-hub-mu.vercel.app',
  process.env.FRONTEND_URL // Allow custom frontend URL from environment
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now - restrict in production if needed
    }
  },
  credentials: true
}));

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

// Export for Vercel serverless functions
module.exports = (req, res) => app(req, res);

// SERVER START (for local development)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("═══════════════════════════════════════");
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/`);
    console.log(`📍 API endpoint: http://localhost:${PORT}/notes`);
    console.log("═══════════════════════════════════════");
  });
}
