// Import the Express library
const express = require('express');

// Create an instance of an Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the port the server will listen on
const PORT = process.env.PORT || 3000;

// --- In-Memory API Data Store (MVP) ---
const fullApiCatalog = [ /* Copy the full catalog array from previous version here */
  { id: 'stripe-v1', name: 'Stripe API', category: 'Payments', description: '...', docsUrl: '...', tags: [], status: 'active', metadata: { latency_ms: 150, uptime_percent: 99.99, version: '...' } },
  { id: 'twilio-sms-v1', name: 'Twilio SMS API', category: 'Communication', description: '...', docsUrl: '...', tags: [], status: 'active', metadata: { latency_ms: 200, uptime_percent: 99.95, version: '...' } },
  { id: 'google-maps-js-v3', name: 'Google Maps JavaScript API', category: 'Mapping', description: '...', docsUrl: '...', tags: [], status: 'active', metadata: { latency_ms: 100, uptime_percent: 99.98, version: '...' } }
  // Ensure you have the full data for all 3 APIs here.
];
// --- End In-Memory Data ---


// --- Placeholder AI Security Analysis ---
function aiSecurityPlaceholder(requestDetails) {
  console.log(`[AI Security Placeholder] Analyzing request for API: ${requestDetails.apiId}`);
  let riskScore = 0;
  let reason = 'Low Risk';
  let allow = true;

  if (requestDetails.apiId === 'stripe-v1' && !requestDetails.params?.amount) {
    riskScore += 50; reason = 'Potential Payment Fraud: Missing amount parameter.';
  }
  if (requestDetails.userContext?.location === 'UnusualLocation') {
    riskScore += 30; reason = 'Potential Account Takeover: Request from unusual location.';
  }
  if (riskScore >= 70) {
    allow = false; reason = `High Risk Detected (${riskScore}): ${reason}`;
    console.warn(`[AI Security Placeholder] Blocking request due to high risk: ${reason}`);
  } else if (riskScore > 0) {
     console.log(`[AI Security Placeholder] Elevated risk (${riskScore}): ${reason}`);
  } // Keep logs concise: else { console.log(`[AI Security Placeholder] Request assessed as low risk.`); }

  return { allow, riskScore, reason };
}
// --- End Placeholder AI ---


// --- API Endpoints ---

// Root endpoint
app.get('/', (req, res) => res.status(200).json({ message: 'LinkSphere MVP API is running!' }));

// Get API list endpoint
app.get('/apis', (req, res) => res.status(200).json({ count: fullApiCatalog.length, data: fullApiCatalog }));

// Simulate making a single API call (used by SDK's callApi)
app.post('/api/call-simulation', (req, res) => {
  const requestDetails = req.body;
  if (!requestDetails?.apiId || !requestDetails.params || !requestDetails.userContext) {
    return res.status(400).json({ error: 'Invalid request body. Requires apiId, params, and userContext.' });
  }
  const securityResult = aiSecurityPlaceholder(requestDetails);
  if (!securityResult.allow) {
    return res.status(403).json({ status: 'blocked', reason: securityResult.reason, riskScore: securityResult.riskScore });
  }
  console.log(`[API Call Simulation] Security check passed for ${requestDetails.apiId}. Simulating successful call.`);
  return res.status(200).json({ status: 'success', message: `Simulated successful call to API: ${requestDetails.apiId}`, securityRiskScore: securityResult.riskScore, paramsReceived: requestDetails.params });
});

// New endpoint to simulate orchestrating a workflow
// POST /api/orchestrate-simulation
app.post('/api/orchestrate-simulation', (req, res) => {
  const workflow = req.body;

  // Validate basic workflow structure
  if (!workflow?.name || !Array.isArray(workflow.steps) || !workflow.userContext) {
    return res.status(400).json({ error: 'Invalid workflow definition. Requires name, steps (array), and userContext.' });
  }
  if (workflow.steps.length === 0) {
       return res.status(400).json({ error: 'Workflow must contain at least one step.' });
   }

  console.log(`\n[Orchestration Simulation] Starting workflow: ${workflow.name}`);
  const results = [];
  let overallStatus = 'success'; // Assume success initially

  // Simulate executing each step sequentially
  for (let i = 0; i < workflow.steps.length; i++) {
    const step = workflow.steps[i];
    console.log(`[Orchestration Simulation] Executing Step ${i + 1}: Call API ${step.apiId}`);

    if (!step.apiId || !step.params) {
         console.error(`[Orchestration Simulation] Step ${i + 1} is invalid (missing apiId or params). Skipping.`);
         results.push({ step: i + 1, status: 'error', message: 'Invalid step definition' });
         overallStatus = 'failed';
         break; // Stop workflow on invalid step definition
    }

    // Prepare details for security check (using workflow's user context)
    const requestDetails = {
      apiId: step.apiId,
      params: step.params,
      userContext: workflow.userContext // Use context from the workflow definition
    };

    // Perform security check for this step
    const securityResult = aiSecurityPlaceholder(requestDetails);

    if (!securityResult.allow) {
      console.error(`[Orchestration Simulation] Step ${i + 1} (${step.apiId}) Blocked by security: ${securityResult.reason}`);
      results.push({ step: i + 1, apiId: step.apiId, status: 'blocked', reason: securityResult.reason, riskScore: securityResult.riskScore });
      overallStatus = 'failed'; // Mark workflow as failed if any step is blocked
      break; // Stop workflow execution if a step is blocked
    } else {
      // Simulate successful execution of the step
       console.log(`[Orchestration Simulation] Step ${i + 1} (${step.apiId}) executed successfully (simulated).`);
       results.push({ step: i + 1, apiId: step.apiId, status: 'success', securityRiskScore: securityResult.riskScore });
       // In a real orchestrator, the output of this step might feed into the next step's params
    }
  } // End of steps loop

  console.log(`[Orchestration Simulation] Workflow ${workflow.name} finished with status: ${overallStatus}\n`);

  // Return the overall status and results of each step
  res.status(200).json({
    workflowName: workflow.name,
    overallStatus: overallStatus,
    results: results
  });
});

// --- End API Endpoints ---

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`  Access root at: http://localhost:${PORT}`);
  console.log(`  Access APIs at: http://localhost:${PORT}/apis`);
  console.log(`  Simulate API calls via POST to: http://localhost:${PORT}/api/call-simulation`);
  console.log(`  Simulate Orchestration via POST to: http://localhost:${PORT}/api/orchestrate-simulation`); // Added this line
});

// Export the app instance
module.exports = app;