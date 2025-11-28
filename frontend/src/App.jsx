import React, { useState, useEffect } from "react";

const App = () => {
  const [Title, SetTitle] = useState("");
  const [Details, SetDetails] = useState("");
  const [Notes, SetNotes] = useState([]);

  // API base URL - use environment variable or fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "/api";
  
  // Debug: Log the API URL being used (remove in production if needed)
  console.log("API URL:", API_URL);
  console.log("Environment variable:", import.meta.env.VITE_API_URL);

  // Load notes from backend
  useEffect(() => {
    fetch(`${API_URL}/notes`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            if (res.status === 503) {
              throw new Error(`Database Error: ${errorData.error || errorData.msg}`);
            }
            throw new Error(`HTTP error! status: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        // Check if data is an array (notes) or error object
        if (Array.isArray(data)) {
          SetNotes(data);
        } else if (data.error) {
          throw new Error(data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
        if (error.message.includes("Database") || error.message.includes("MongoDB")) {
          alert(`Database Connection Error:\n\n${error.message}\n\nPlease check your MongoDB connection string and IP whitelist settings.`);
        } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          alert("Cannot connect to backend server!\n\nMake sure the backend server is running on port 5000.\n\nTo start: cd backend && node server.js");
        } else {
          alert(`Failed to load notes: ${error.message}`);
        }
      });
  }, []);

  const submithandler = async (e) => {
    e.preventDefault();
    console.log("Form submitted!", { Title, Details });

    // Validate inputs
    if (!Title.trim() || !Details.trim()) {
      alert("Please fill in both title and details!");
      return;
    }

    try {
      console.log("Sending request to backend...");
      // Send note to backend
      const response = await fetch(`${API_URL}/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: Title,
          details: Details,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 503) {
          throw new Error(`Database Error: ${errorData.error || errorData.msg}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Note saved successfully:", data);

      // Update UI instantly
      SetNotes([...Notes, data.newNote]);

      SetTitle("");
      SetDetails("");
    } catch (error) {
      console.error("Error adding note:", error);
      if (error.message.includes("Database") || error.message.includes("MongoDB")) {
        alert(`Database Connection Error:\n\n${error.message}\n\nPlease check your MongoDB connection string and IP whitelist settings.`);
      } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        alert("Cannot connect to backend server!\n\nMake sure the backend server is running on port 5000.\n\nTo start: cd backend && node server.js");
      } else {
        alert(`Failed to add note: ${error.message}`);
      }
    }
  };

  const deleteNote = async (noteId) => {
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      console.log("Deleting note:", noteId);
      const response = await fetch(`${API_URL}/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 503) {
          throw new Error(`Database Error: ${errorData.error || errorData.msg}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Note deleted successfully:", data);

      // Update UI by removing the deleted note
      SetNotes(Notes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
      if (error.message.includes("Database") || error.message.includes("MongoDB")) {
        alert(`Database Connection Error:\n\n${error.message}\n\nPlease check your MongoDB connection string and IP whitelist settings.`);
      } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        alert("Cannot connect to backend server!\n\nMake sure the backend server is running on port 5000.");
      } else {
        alert(`Failed to delete note: ${error.message}`);
      }
    }
  };

  return (
    <div className="h-screen lg:flex bg-black">
      <form
        onSubmit={submithandler}
        className="flex items-start lg:w-1/2 flex-col p-10 gap-4"
      >
        <h1 className="font-bold text-4xl text-white">Add Notes</h1>

        <input
          type="text"
          placeholder="Enter Notes heading"
          className="px-5 w-full py-2 text-white rounded border"
          value={Title}
          onChange={(e) => SetTitle(e.target.value)}
        />

        <textarea
          className="px-5 w-full outline-none py-2 rounded border text-white"
          placeholder="Enter details"
          value={Details}
          onChange={(e) => SetDetails(e.target.value)}
        />

        <button
          className="w-full outline-none text-black bg-white rounded py-3 px-4 font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
          type="submit"
          onClick={() => console.log("Button clicked!")}
        >
          Add Note
        </button>
      </form>

      <div className="flex lg:w-1/2 lg:border-l-2 bg-black flex-col p-10 overflow-auto">
        <h1 className="text-3xl font-bold text-white px-4">Recent Notes</h1>

        <div className="flex flex-wrap gap-5 mt-5 h-full overflow-auto">
          {Notes.map((note) => (
            <div
              key={note._id}
              className="p-3 h-32 w-32 rounded-2xl bg-white flex flex-col relative group"
            >
              <button
                onClick={() => deleteNote(note._id)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Delete note"
              >
                ×
              </button>
              <h2 className="font-bold text-sm pr-6">{note.title}</h2>
              <p className="text-xs mt-1 flex-1 overflow-hidden">{note.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
