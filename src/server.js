// Import the Express library
const express = require('express');

// Create an instance of an Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json()); // Important: Add this line to handle POST request data

// Define the port the server will listen on
const PORT = process.env.PORT || 3000;

// --- In-Memory API Data Store (MVP) ---
const apiCatalog = [
    { id: 'stripe-v1', name: 'Stripe API', category: 'Payments', /* ... */ },
    { id: 'twilio-sms-v1', name: 'Twilio SMS API', category: 'Communication', /* ... */ },
    { id: 'google-maps-js-v3', name: 'Google Maps JavaScript API', category: 'Mapping', /* ... */ }
    // Note: Only showing IDs/Names/Categories for brevity in this snippet
];
// Add full data back from previous version if needed, or copy/paste the full block again.
// Ensure the full objects with metadata are here. (Self-correction: Pasting full objects below for clarity)
const fullApiCatalog = [
  {
    id: 'stripe-v1',
    name: 'Stripe API',
    category: 'Payments',
    description: 'Process payments and manage subscriptions.',
    docsUrl: 'https://stripe.com/docs/api',
    tags: ['payments', 'billing', 'finance'],
    status: 'active',
    metadata: { latency_ms: 150, uptime_percent: 99.99, version: '2022-11-15' }
  },
  {
    id: 'twilio-sms-v1',
    name: 'Twilio SMS API',
    category: 'Communication',
    description: 'Send and receive SMS messages.',
    docsUrl: 'https://www.twilio.com/docs/sms/api',
    tags: ['sms', 'messaging', 'communication'],
    status: 'active',
    metadata: { latency_ms: 200, uptime_percent: 99.95, version: 'v1' }
  },
  {
    id: 'google-maps-js-v3',
    name: 'Google Maps JavaScript API',
    category: 'Mapping',
    description: 'Display maps and geographic information.',
    docsUrl: 'https://developers.google.com/maps/documentation/javascript/overview',
    tags: ['maps', 'geolocation', 'places'],
    status: 'active',
    metadata: { latency_ms: 100, uptime_percent: 99.98, version: '3.5x' }
  }
];
// --- End In-Memory Data ---


// --- Placeholder AI Security Analysis ---
/**
 * Simulates an AI security check on an API call request.
 * In a real system, this would involve complex analysis (LLM, heuristics).
 * For MVP, it performs basic checks and returns a risk score.
 * @param {object} requestDetails - Details about the simulated API call.
 * @param {string} requestDetails.apiId - The ID of the API being called.
 * @param {object} requestDetails.params - Parameters sent to the API.
 * @param {string} requestDetails.userContext - Info about the user making the call (e.g., IP, location - simplified).
 * @returns {object} - An object containing { allow: boolean, riskScore: number, reason: string }
 */
function aiSecurityPlaceholder(requestDetails) {
  console.log(`[AI Security Placeholder] Analyzing request for API: ${requestDetails.apiId}`);
  let riskScore = 0;
  let reason = 'Low Risk';
  let allow = true;

  // Basic Placeholder Rules:
  // Rule 1: Penalize if critical parameters are missing (very basic example)
  if (requestDetails.apiId === 'stripe-v1' && !requestDetails.params?.amount) {
    riskScore += 50;
    reason = 'Potential Payment Fraud: Missing amount parameter.';
  }

  // Rule 2: Penalize calls from unusual contexts (super simplified)
  if (requestDetails.userContext?.location === 'UnusualLocation') {
    riskScore += 30;
    reason = 'Potential Account Takeover: Request from unusual location.';
  }

   // Rule 3: Block if risk score is too high
  if (riskScore >= 70) {
    allow = false;
    reason = `High Risk Detected (${riskScore}): ${reason}`;
    console.warn(`[AI Security Placeholder] Blocking request due to high risk: ${reason}`);
  } else if (riskScore > 0) {
     console.log(`[AI Security Placeholder] Elevated risk (${riskScore}): ${reason}`);
  } else {
     console.log(`[AI Security Placeholder] Request assessed as low risk.`);
  }


  return {
    allow: allow,
    riskScore: riskScore,
    reason: reason
  };
}
// --- End Placeholder AI ---


// --- API Endpoints ---

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'LinkSphere MVP API is running!' });
});

// Get API list endpoint
app.get('/apis', (req, res) => {
  res.status(200).json({
    count: fullApiCatalog.length, // Use the full catalog here
    data: fullApiCatalog
  });
});

// New endpoint to simulate making an API call via LinkSphere
// POST /api/call-simulation
app.post('/api/call-simulation', (req, res) => {
  const requestDetails = req.body; // Get details from the POST request body

  // Validate basic input
  if (!requestDetails || !requestDetails.apiId || !requestDetails.params || !requestDetails.userContext) {
    return res.status(400).json({ error: 'Invalid request body. Requires apiId, params, and userContext.' });
  }

  // 1. Perform Placeholder Security Check
  const securityResult = aiSecurityPlaceholder(requestDetails);

  // 2. If security check fails, block the request
  if (!securityResult.allow) {
    return res.status(403).json({ // 403 Forbidden
      status: 'blocked',
      reason: securityResult.reason,
      riskScore: securityResult.riskScore
    });
  }

  // 3. If security check passes, simulate the API call (just return success for MVP)
  console.log(`[API Call Simulation] Security check passed for ${requestDetails.apiId}. Simulating successful call.`);
  // In a real scenario, LinkSphere would now connect to the actual external API (Stripe, Twilio etc.)
  // For MVP, we just return a success message.
  return res.status(200).json({
    status: 'success',
    message: `Simulated successful call to API: ${requestDetails.apiId}`,
    securityRiskScore: securityResult.riskScore,
    // Echoing back params for confirmation
    paramsReceived: requestDetails.params
  });
});

// --- End API Endpoints ---

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Access root at: http://localhost:${PORT}`);
  console.log(`Access APIs at: http://localhost:${PORT}/apis`);
  console.log(`Simulate API calls via POST to: http://localhost:${PORT}/api/call-simulation`); // Added this line
});

// Export the app instance
module.exports = app;