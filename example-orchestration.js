// Import the LinkSphere SDK client
const LinkSphereClient = require('./sdk/linksphere');

// Create a new instance of the client
const client = new LinkSphereClient();

// --- Workflow Definitions ---

// Example 1: Successful Payment and Notification (Unchanged)
const successWorkflow = {
  name: 'Payment Confirmation',
  userContext: { userId: 'user789', location: 'KnownLocation', transactionId: 'txn_abc' },
  steps: [
    { apiId: 'stripe-v1', params: { amount: 5000, currency: 'usd', source: 'tok_visa' } },
    { apiId: 'twilio-sms-v1', params: { to: '+15551234567', body: 'Your payment of $50 was successful. Ref: txn_abc' } }
  ]
};

// Example 2: Workflow DEFINITELY blocked by security (High Risk)
// Combines missing 'amount' for Stripe AND 'UnusualLocation' context
// Expected Risk Score = 50 (missing amount) + 30 (unusual location) = 80 -> Blocked
const highRiskWorkflow = {
   name: 'High Risk Payment Attempt',
   userContext: { userId: 'user111', location: 'UnusualLocation', transactionId: 'txn_xyz' },
   steps: [
     { // Step 1: Attempt charge with missing amount from unusual location
       apiId: 'stripe-v1',
       params: { currency: 'usd', source: 'tok_mastercard' } // Missing 'amount'
     },
     { // Step 2: This step should not be reached
       apiId: 'twilio-sms-v1',
       params: { to: '+15559876543', body: 'High-value transaction attempted. Ref: txn_xyz' }
     }
   ]
};

// Example 3: Workflow with elevated risk but NOT blocked (for comparison)
// Just missing 'amount' => Risk Score = 50 -> Allowed
 const elevatedRiskWorkflow = {
    name: 'Payment With Missing Param',
    userContext: { userId: 'user222', location: 'KnownLocation', transactionId: 'txn_pqr' },
    steps: [
      { // Step 1: Payment missing amount
        apiId: 'stripe-v1',
        params: { currency: 'usd', source: 'tok_amex' } // Missing 'amount'
      },
      { // Step 2: Notification (should still run)
        apiId: 'twilio-sms-v1',
        params: { to: '+15551112222', body: 'Payment processed.' }
      }
   ]
};


// Define an async function to run the examples
async function runOrchestrationExamples() {
  console.log("\n--- Running Successful Workflow Example ---");
  try {
    const result1 = await client.orchestrateWorkflow(successWorkflow);
    console.log("Workflow Result:", JSON.stringify(result1, null, 2));
  } catch (error) {
    console.error("Workflow Failed:", error.message);
  }

  console.log("\n--- Running High Risk (Blocked) Workflow Example ---");
  try {
    const result2 = await client.orchestrateWorkflow(highRiskWorkflow);
    console.log("Workflow Result:", JSON.stringify(result2, null, 2)); // Should contain blocked step 1
  } catch (error) {
    console.error("Workflow Execution Error (SDK/Connection):", error.message);
  }

   console.log("\n--- Running Elevated Risk (Not Blocked) Workflow Example ---");
  try {
    const result3 = await client.orchestrateWorkflow(elevatedRiskWorkflow);
    console.log("Workflow Result:", JSON.stringify(result3, null, 2)); // Should show success with risk score 50 on step 1
  } catch (error) {
    console.error("Workflow Execution Error (SDK/Connection):", error.message);
  }
}

// Execute the example function
runOrchestrationExamples();