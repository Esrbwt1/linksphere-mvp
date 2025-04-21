// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb'); // Import MongoDB client

// --- Configuration ---
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// MongoDB Connection URI - Loaded from .env file
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("FATAL ERROR: MONGODB_URI environment variable is not set.");
  process.exit(1); // Exit if the connection string is missing
}

// MongoDB Client Initialization
const mongoClient = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database and Collection References (will be assigned after connection)
let db;
let apiCollection;
const DB_NAME = 'linkSphereDb'; // Choose a name for your database
const API_COLLECTION_NAME = 'apis';

// --- Initial API Data for Seeding ---
const initialApiData = [
    { apiId: 'stripe-v1', name: 'Stripe API', category: 'Payments', description: 'Process payments and manage subscriptions.', docsUrl: 'https://stripe.com/docs/api', tags: ['payments', 'billing', 'finance'], status: 'active', metadata: { latency_ms: 150, uptime_percent: 99.99, version: '2022-11-15' } },
    { apiId: 'twilio-sms-v1', name: 'Twilio SMS API', category: 'Communication', description: 'Send and receive SMS messages.', docsUrl: 'https://www.twilio.com/docs/sms/api', tags: ['sms', 'messaging', 'communication'], status: 'active', metadata: { latency_ms: 200, uptime_percent: 99.95, version: 'v1' } },
    { apiId: 'google-maps-js-v3', name: 'Google Maps JavaScript API', category: 'Mapping', description: 'Display maps and geographic information.', docsUrl: 'https://developers.google.com/maps/documentation/javascript/overview', tags: ['maps', 'geolocation', 'places'], status: 'active', metadata: { latency_ms: 100, uptime_percent: 99.98, version: '3.5x' } }
];

// --- Database Connection and Seeding Function ---
async function connectDbAndSeed() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoClient.connect();
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 }); // Ping admin database
    console.log("Successfully connected to MongoDB Atlas!");

    // Assign database and collection references
    db = mongoClient.db(DB_NAME);
    apiCollection = db.collection(API_COLLECTION_NAME);
    console.log(`Connected to database: ${DB_NAME}, collection: ${API_COLLECTION_NAME}`);

    // Check if the collection is empty and seed if necessary
    const count = await apiCollection.countDocuments();
    if (count === 0) {
      console.log("API collection is empty. Seeding initial data...");
      // Use insertMany for seeding
      // We use apiId as the document _id for uniqueness
      const seedData = initialApiData.map(api => ({ _id: api.apiId, ...api }));
      const result = await apiCollection.insertMany(seedData);
      console.log(`Seeded ${result.insertedCount} APIs into the collection.`);
    } else {
      console.log(`API collection already contains ${count} documents. Skipping seed.`);
    }

  } catch (err) {
    console.error("Failed to connect to MongoDB or seed data:", err);
    process.exit(1); // Exit the application if DB connection fails
  }
  // We don't explicitly close the connection here, keep it open for the app lifetime
  // await mongoClient.close(); // Don't close here
}


// --- Placeholder AI Security Analysis (Unchanged) ---
function aiSecurityPlaceholder(requestDetails) {
   /* ... keep the exact same function code from previous version ... */
    console.log(`[AI Security Placeholder] Analyzing request for API: ${requestDetails.apiId}`);
    let riskScore = 0; let reason = 'Low Risk'; let allow = true;
    if (requestDetails.apiId === 'stripe-v1' && !requestDetails.params?.amount) { riskScore += 50; reason = 'Potential Payment Fraud: Missing amount parameter.';}
    if (requestDetails.userContext?.location === 'UnusualLocation') { riskScore += 30; reason = 'Potential Account Takeover: Request from unusual location.';}
    if (riskScore >= 70) { allow = false; reason = `High Risk Detected (${riskScore}): ${reason}`; console.warn(`[AI Security Placeholder] Blocking request due to high risk: ${reason}`);}
    else if (riskScore > 0) { console.log(`[AI Security Placeholder] Elevated risk (${riskScore}): ${reason}`);}
    return { allow, riskScore, reason };
}
// --- End Placeholder AI ---


// --- API Endpoints ---

// Root endpoint
app.get('/', (req, res) => res.status(200).json({ message: 'LinkSphere MVP API is running!' }));

// Get API list endpoint - NOW FETCHES FROM MONGODB
app.get('/apis', async (req, res) => {
  try {
    // Find all documents in the apiCollection
    // .toArray() executes the query and returns the results as an array
    // We exclude the default _id field MongoDB adds unless we explicitly set it
    const apis = await apiCollection.find({}, { projection: { _id: 0 } }).toArray();
    res.status(200).json({
      count: apis.length,
      data: apis
    });
  } catch (err) {
    console.error("Error fetching APIs from database:", err);
    res.status(500).json({ error: "Internal Server Error retrieving API list." });
  }
});

// Simulate making a single API call (Unchanged Logic, uses placeholder AI)
app.post('/api/call-simulation', (req, res) => {
   /* ... keep the exact same endpoint code from previous version ... */
    const requestDetails = req.body;
    if (!requestDetails?.apiId || !requestDetails.params || !requestDetails.userContext) { return res.status(400).json({ error: 'Invalid request body...' });}
    const securityResult = aiSecurityPlaceholder(requestDetails);
    if (!securityResult.allow) { return res.status(403).json({ status: 'blocked', reason: securityResult.reason, riskScore: securityResult.riskScore });}
    console.log(`[API Call Simulation] Security check passed for ${requestDetails.apiId}. Simulating successful call.`);
    return res.status(200).json({ status: 'success', message: `Simulated successful call to API: ${requestDetails.apiId}`, securityRiskScore: securityResult.riskScore, paramsReceived: requestDetails.params });
});

// Simulate orchestrating a workflow (Unchanged Logic, uses placeholder AI)
app.post('/api/orchestrate-simulation', (req, res) => {
    /* ... keep the exact same endpoint code from previous version ... */
    const workflow = req.body;
    if (!workflow?.name || !Array.isArray(workflow.steps) || !workflow.userContext) { return res.status(400).json({ error: 'Invalid workflow definition...' });}
    if (workflow.steps.length === 0) { return res.status(400).json({ error: 'Workflow must contain at least one step.' });}
    console.log(`\n[Orchestration Simulation] Starting workflow: ${workflow.name}`);
    const results = []; let overallStatus = 'success';
    for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i]; console.log(`[Orchestration Simulation] Executing Step ${i + 1}: Call API ${step.apiId}`);
        if (!step.apiId || !step.params) { console.error(`... Invalid step ...`); results.push({ step: i + 1, status: 'error', message: 'Invalid step definition' }); overallStatus = 'failed'; break; }
        const requestDetails = { apiId: step.apiId, params: step.params, userContext: workflow.userContext };
        const securityResult = aiSecurityPlaceholder(requestDetails);
        if (!securityResult.allow) { console.error(`... Step ${i + 1} (${step.apiId}) Blocked ...`); results.push({ step: i + 1, apiId: step.apiId, status: 'blocked', reason: securityResult.reason, riskScore: securityResult.riskScore }); overallStatus = 'failed'; break; }
        else { console.log(`... Step ${i + 1} (${step.apiId}) executed successfully ...`); results.push({ step: i + 1, apiId: step.apiId, status: 'success', securityRiskScore: securityResult.riskScore });}
    }
    console.log(`[Orchestration Simulation] Workflow ${workflow.name} finished with status: ${overallStatus}\n`);
    res.status(200).json({ workflowName: workflow.name, overallStatus: overallStatus, results: results });
});

// --- End API Endpoints ---


// --- Start Server ---
// Connect to DB first, then start listening for HTTP requests
connectDbAndSeed().then(() => {
    app.listen(PORT, () => {
        console.log(`\nHTTP Server listening on port ${PORT}`);
        console.log(`  Access root at: http://localhost:${PORT}`);
        console.log(`  Access APIs at: http://localhost:${PORT}/apis`);
        console.log(`  Simulate API calls via POST to: http://localhost:${PORT}/api/call-simulation`);
        console.log(`  Simulate Orchestration via POST to: http://localhost:${PORT}/api/orchestrate-simulation`);
    });
}).catch(err => {
    // Catch any error during DB connection that wasn't handled
    console.error("Application startup failed due to DB connection error.", err);
    process.exit(1);
});


// Export the app instance (less useful now as startup is async)
// module.exports = app; // Commenting out for now