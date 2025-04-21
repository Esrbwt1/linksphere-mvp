// Import the Express library
const express = require('express');

// Create an instance of an Express application
const app = express();

// Define the port the server will listen on
const PORT = process.env.PORT || 3000;

// --- In-Memory API Data Store (MVP) ---
// In a real app, this would come from a database.
const apiCatalog = [
  {
    id: 'stripe-v1',
    name: 'Stripe API',
    category: 'Payments',
    description: 'Process payments and manage subscriptions.',
    docsUrl: 'https://stripe.com/docs/api',
    tags: ['payments', 'billing', 'finance'],
    status: 'active',
    // Placeholder for metadata we might add later
    metadata: {
      latency_ms: 150,
      uptime_percent: 99.99,
      version: '2022-11-15'
    }
  },
  {
    id: 'twilio-sms-v1',
    name: 'Twilio SMS API',
    category: 'Communication',
    description: 'Send and receive SMS messages.',
    docsUrl: 'https://www.twilio.com/docs/sms/api',
    tags: ['sms', 'messaging', 'communication'],
    status: 'active',
    metadata: {
      latency_ms: 200,
      uptime_percent: 99.95,
      version: 'v1'
    }
  },
  {
    id: 'google-maps-js-v3',
    name: 'Google Maps JavaScript API',
    category: 'Mapping',
    description: 'Display maps and geographic information.',
    docsUrl: 'https://developers.google.com/maps/documentation/javascript/overview',
    tags: ['maps', 'geolocation', 'places'],
    status: 'active',
    metadata: {
      latency_ms: 100,
      uptime_percent: 99.98,
      version: '3.5x' // Example versioning
    }
  }
  // Add more initial APIs here later if needed
];
// --- End In-Memory Data ---


// --- API Endpoints ---

// Root endpoint (unchanged)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'LinkSphere MVP API is running!' });
});

// New endpoint to get the list of APIs
// GET /apis
app.get('/apis', (req, res) => {
  // For now, just return the entire catalog
  // Later, we can add filtering, pagination etc.
  res.status(200).json({
    count: apiCatalog.length,
    data: apiCatalog
  });
});

// --- End API Endpoints ---


// Start the server (unchanged)
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Access root at: http://localhost:${PORT}`);
  console.log(`Access APIs at: http://localhost:${PORT}/apis`); // Added this line
});

// Export the app instance (unchanged)
module.exports = app;