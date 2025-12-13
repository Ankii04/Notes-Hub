import app from './api/index.js';
import http from 'http';

// Create a simple server to forward requests to the app
const server = http.createServer((req, res) => {
    // Simulate the Vercel serverless environment
    // Vercel passes (req, res) to the exported function
    try {
        app(req, res);
    } catch (err) {
        console.error("CRASH CAUGHT IN SERVER:", err);
        res.statusCode = 500;
        res.end("A server error has occurred");
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Debug server running at http://localhost:${PORT}`);
    console.log("Testing /api/notes with undefined MONGODB_URI...");

    // Make a request
    const req = http.get(`http://localhost:${PORT}/api/notes`, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            console.log(`Response Status: ${res.statusCode}`);
            console.log(`Response Body: ${data}`);
            server.close();
        });
    });

    req.on('error', (e) => {
        console.error(`Request error: ${e.message}`);
        server.close();
    });
});
