const express = require('express'); // Import the Express library
const fs = require('fs'); // Import the file system module
const path = require('path'); // Import the path module

const app = express(); // Create an instance of an Express application
const PORT = process.env.PORT || 3000; // Set the port to the environment variable or 3000

app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(express.json()); // Parse incoming JSON requests

// Route to serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Send the index.html file
});

// Route to get the search history from the JSON file
app.get('/api/weather/history', (req, res) => {
  fs.readFile('searchHistory.json', 'utf8', (err, data) => { // Read the searchHistory.json file
    if (err) {
      return res.status(500).json({ error: 'Failed to read search history' }); // Send an error response if reading fails
    }
    res.json(JSON.parse(data)); // Parse the JSON data and send it as a response
  });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log a message when the server starts
});