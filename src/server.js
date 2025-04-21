// Import the Express library
const express = require('express');

// Create an instance of an Express application
const app = express();

// Define the port the server will listen on
// Use the environment variable PORT if available, otherwise default to 3000
const PORT = process.env.PORT || 3000;

// Define a simple route for the root URL ('/')
// When a GET request is made to '/', this function will run
app.get('/', (req, res) => {
  // Send a JSON response back to the client
  res.status(200).json({ message: 'LinkSphere MVP API is running!' });
});

// Start the server and make it listen for connections on the specified port
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Access it at: http://localhost:${PORT}`);
});

// Export the app instance (useful for testing later)
module.exports = app;