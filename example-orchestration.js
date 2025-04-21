// Import the LinkSphere SDK client
const LinkSphereClient = require('./sdk/linksphere');

// Create a new instance of the client
const client = new LinkSphereClient();

// --- Workflow Definitions ---

// Example 1: Successful Payment and Notification
const successWorkflow = {
  name: 'Payment Confirmation',
  userContext: { userId: 'user789', location: 'KnownLocation', transactionId: 'txn_abc' },
  steps: [
    { // Step 1: Charge card using Stripe
      apiId: 'stripe-v1',
      params: { amount: 5000, currency: 'usd', source: 'tok_visa' }
    },
    { // Step 2: Send SMS confirmation using Twilio
      apiId: 'twilio-sms-v1',
      params: { to: '+15551234567', body: 'Your payment of $50 was successful. Ref: txn_abc' }
      // Note: In a real scenario, params might use output from Step 1 (e.g., payment amount)
    }
  ]
};

// Example 2: Workflow blocked by security (unusual location)
const blockedWorkflow = {
   name: 'Risky Payment Attempt',
   userContext: { userId: 'user111', location: 'UnusualLocation', transactionId: 'txn_xyz' },
   steps: [
     { // Step 1: Attempt charge from unusual location
       apiId: 'stripe-v1',
       params: { amount: 10000, currency: 'usd', source: 'tok_mastercard' }
     },
     { // Step 2: This step won't be reached if Step 1 is blocked
       apiId: 'twilio-sms-v1',
       params: { to: '+15559876543', body: 'High-value transaction attempted. Ref: txn_xyz' }
     }
   ]
};

// Example 3: Workflow fails due to high-risk second step
const partialFailWorkflow = {
    name: 'Payment With Risky Notification',
    userContext: { userId: 'user222', location: 'KnownLocation', transactionId: 'txn_pqr' },
    steps: [
      { // Step 1: Successful Payment
        apiId: 'stripe-v1',
        params: { amount: 2500, currency: 'usd', source: 'tok_amex' }
      },
      { // Step 2: Try sending SMS but from a context that triggers high risk in security check
        // We'll simulate this by using 'UnusualLocation' just for this *step's effective check*
        // (Our current placeholder uses workflow context, so we modify the *workflow* context to test)
        // Let's make a new workflow for this specific test case:
        apiId: 'twilio-sms-v1', // Let's imagine Twilio call itself is fine
        params: { to: '+15551112222', body: 'Payment processed.' }
      }
   ]
};
// To actually test the partial fail scenario where step 2 is blocked,
// we need to modify the *workflow's* userContext as our security check only looks there.
 const partialFailWorkflowAdjusted = {
    name: 'Payment Blocked At Notification',
    userContext: { userId: 'user333', location: 'UnusualLocation', transactionId: 'txn_stu' }, // Risky context
    steps: [
      { // Step 1: Attempt Payment (will be blocked due to context)
        apiId: 'stripe-v1',
        params: { amount: 3000, currency: 'usd', source: 'tok_visa' }
      },
      { // Step 2: Notification (won't run)
        apiId: 'twilio-sms-v1',
        params: { to: '+15553334444', body: 'Payment attempt logged.' }
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

  console.log("\n--- Running Blocked Workflow Example ---");
  try {
    const result2 = await client.orchestrateWorkflow(blockedWorkflow);
    console.log("Workflow Result:", JSON.stringify(result2, null, 2)); // Should contain blocked step
  } catch (error) {
    // The current orchestrate simulation endpoint returns 200 even if failed/blocked,
    // so errors here are likely connection issues. The result object shows the failure.
    console.error("Workflow Execution Error (SDK/Connection):", error.message);
  }

   console.log("\n--- Running Partially Blocked Workflow Example ---");
  try {
    // Using the adjusted workflow where the context makes the first step risky
    const result3 = await client.orchestrateWorkflow(partialFailWorkflowAdjusted);
    console.log("Workflow Result:", JSON.stringify(result3, null, 2)); // Should show step 1 blocked
  } catch (error) {
    console.error("Workflow Execution Error (SDK/Connection):", error.message);
  }

}

// Execute the example function
runOrchestrationExamples();