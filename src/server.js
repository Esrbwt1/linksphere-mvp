// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

// --- Configuration ---
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;
const expectedApiKey = process.env.LINKSPEHERE_MVP_API_KEY; // Load the expected API key

// Basic validation
if (!mongoUri) { console.error("FATAL ERROR: MONGODB_URI missing."); process.exit(1); }
if (!expectedApiKey) { console.warn("WARNING: LINKSPEHERE_MVP_API_KEY environment variable is not set. API key checks will fail."); } // Warn if key is missing

// MongoDB Client Initialization, DB Refs, DB_NAME, COLLECTION_NAME (Unchanged)
const mongoClient = new MongoClient(mongoUri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true } });
let db;
let apiCollection;
const DB_NAME = 'linkSphereDb';
const API_COLLECTION_NAME = 'apis';

// --- Initial API Data for Seeding (Unchanged) ---
const initialApiData = [ /* ... copy/paste the full initialApiData array here ... */
    { apiId: 'stripe-v1', name: 'Stripe API', /*...*/ },
    { apiId: 'twilio-sms-v1', name: 'Twilio SMS API', /*...*/ },
    { apiId: 'google-maps-js-v3', name: 'Google Maps JavaScript API', /*...*/ }
];

// --- Database Connection and Seeding Function (Unchanged) ---
async function connectDbAndSeed() { /* ... keep the exact same function code ... */
    try {
        await mongoClient.connect(); await mongoClient.db("admin").command({ ping: 1 });
        console.log("Successfully connected to MongoDB Atlas!");
        db = mongoClient.db(DB_NAME); apiCollection = db.collection(API_COLLECTION_NAME);
        console.log(`Connected to database: ${DB_NAME}, collection: ${API_COLLECTION_NAME}`);
        const count = await apiCollection.countDocuments();
        if (count === 0) { console.log("API collection empty. Seeding..."); const seedData = initialApiData.map(api => ({ _id: api.apiId, ...api })); const result = await apiCollection.insertMany(seedData); console.log(`Seeded ${result.insertedCount} APIs.`); }
        else { console.log(`API collection already contains ${count} documents. Skipping seed.`); }
    } catch (err) { console.error("Failed to connect/seed MongoDB:", err); process.exit(1); }
}

// --- Placeholder AI Security Analysis (Unchanged) ---
function aiSecurityPlaceholder(requestDetails) { /* ... keep the exact same function code ... */
    console.log(`[AI Security Placeholder] Analyzing request for API: ${requestDetails.apiId}`);
    let riskScore = 0; let reason = 'Low Risk'; let allow = true;
    if (requestDetails.apiId === 'stripe-v1' && !requestDetails.params?.amount) { riskScore += 50; reason = 'Potential Payment Fraud: Missing amount parameter.';}
    if (requestDetails.userContext?.location === 'UnusualLocation') { riskScore += 30; reason = 'Potential Account Takeover: Request from unusual location.';}
    if (riskScore >= 70) { allow = false; reason = `High Risk Detected (${riskScore}): ${reason}`; console.warn(`[AI Security Placeholder] Blocking request due to high risk: ${reason}`);}
    else if (riskScore > 0) { console.log(`[AI Security Placeholder] Elevated risk (${riskScore}): ${reason}`);}
    return { allow, riskScore, reason };
}

// --- NEW: API Key Authentication Middleware ---
const apiKeyMiddleware = (req, res, next) => {
  const providedApiKey = req.headers['x-api-key']; // Standard header for API keys

  if (!expectedApiKey) {
      // If the server key isn't configured, bypass check but log warning
      console.warn("WARNING: Server API Key not configured, bypassing check.");
      return next(); // Allow request through
  }

  if (!providedApiKey) {
    console.warn('[Auth Middleware] Blocked: Missing X-API-Key header');
    return res.status(401).json({ error: 'Unauthorized: Missing API Key' }); // 401 Unauthorized
  }

  if (providedApiKey !== expectedApiKey) {
    console.warn('[Auth Middleware] Blocked: Invalid API Key provided');
    return res.status(403).json({ error: 'Forbidden: Invalid API Key' }); // 403 Forbidden
  }

  // If keys match, proceed to the next middleware or route handler
  console.log('[Auth Middleware] API Key validated successfully.');
  next();
};
// --- End Auth Middleware ---


// --- API Endpoints ---

// Root endpoint (Public - No API Key needed)
app.get('/', (req, res) => res.status(200).json({ message: 'LinkSphere MVP API is running!' }));

// Get API list endpoint (Public - No API Key needed)
app.get('/apis', async (req, res) => { /* ... keep the exact same endpoint code ... */
    try {
        const apis = await apiCollection.find({}, { projection: { _id: 0 } }).toArray();
        res.status(200).json({ count: apis.length, data: apis });
    } catch (err) { console.error("Error fetching APIs:", err); res.status(500).json({ error: "Internal Server Error" });}
});

// Simulate making a single API call (PROTECTED by API Key Middleware)
app.post('/api/call-simulation', apiKeyMiddleware, (req, res) => { // Apply middleware here
   /* ... keep the exact same route handler logic ... */
    const requestDetails = req.body;
    // No need to re-validate requestDetails here, middleware already ran
    const securityResult = aiSecurityPlaceholder(requestDetails);
    if (!securityResult.allow) { return res.status(403).json({ status: 'blocked', reason: securityResult.reason, riskScore: securityResult.riskScore });}
    console.log(`[API Call Simulation] Security check passed for ${requestDetails.apiId}. Simulating successful call.`);
    return res.status(200).json({ status: 'success', message: `Simulated successful call to API: ${requestDetails.apiId}`, securityRiskScore: securityResult.riskScore, paramsReceived: requestDetails.params });
});

// Simulate orchestrating a workflow (PROTECTED by API Key Middleware)
app.post('/api/orchestrate-simulation', apiKeyMiddleware, (req, res) => { // Apply middleware here
    /* ... keep the exact same route handler logic ... */
    const workflow = req.body;
    // No need to re-validate workflow here, middleware already ran
    console.log(`\n[Orchestration Simulation] Starting workflow: ${workflow.name}`);
    const results = []; let overallStatus = 'success';
    for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i]; console.log(`[Orchestration Simulation] Executing Step ${i + 1}: Call API ${step.apiId}`);
        if (!step.apiId || !step.params) { console.error(`... Invalid step ...`); results.push({ step: i + 1, status: 'error', message: 'Invalid step definition' }); overallStatus = 'failed'; break; }
        const requestDetails = { apiId: step.apiId, params: step.params, userContext: workflow.userContext };
        const securityResult = aiSecurityPlaceholder(requestDetails); // Run AI check *after* API key auth
        if (!securityResult.allow) { console.error(`... Step ${i + 1} (${step.apiId}) Blocked by AI ...`); results.push({ step: i + 1, apiId: step.apiId, status: 'blocked', reason: securityResult.reason, riskScore: securityResult.riskScore }); overallStatus = 'failed'; break; }
        else { console.log(`... Step ${i + 1} (${step.apiId}) executed successfully ...`); results.push({ step: i + 1, apiId: step.apiId, status: 'success', securityRiskScore: securityResult.riskScore });}
    }
    console.log(`[Orchestration Simulation] Workflow ${workflow.name} finished with status: ${overallStatus}\n`);
    res.status(200).json({ workflowName: workflow.name, overallStatus: overallStatus, results: results });
});

// --- End API Endpoints ---

// --- Start Server (Unchanged) ---
connectDbAndSeed().then(() => {
    app.listen(PORT, () => {
        console.log(`\nHTTP Server listening on port ${PORT}`);
        /* ... console logs for endpoints ... */
    });
}).catch(err => { console.error("App startup failed:", err); process.exit(1); });