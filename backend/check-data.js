// Quick script to check if data is in MongoDB
const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI || "mongodb+srv://ankitkr1841:Ankit1841@cluster0.sch6n5t.mongodb.net/notesdb?retryWrites=true&w=majority&appName=Cluster0";

const NoteSchema = new mongoose.Schema({
  title: String,
  details: String,
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", NoteSchema);

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("✅ Connected to MongoDB!");
    console.log("📊 Fetching all notes...\n");
    
    const notes = await Note.find().sort({ createdAt: -1 });
    
    if (notes.length === 0) {
      console.log("⚠️  No notes found in the database.");
    } else {
      console.log(`📝 Found ${notes.length} note(s):\n`);
      notes.forEach((note, index) => {
        console.log(`${index + 1}. Title: ${note.title}`);
        console.log(`   Details: ${note.details}`);
        console.log(`   Created: ${note.createdAt}`);
        console.log(`   ID: ${note._id}\n`);
      });
    }
    
    mongoose.connection.close();
    console.log("✅ Connection closed.");
  })
  .catch((err) => {
    console.error("❌ Error:", err.message);
    process.exit(1);
  });
