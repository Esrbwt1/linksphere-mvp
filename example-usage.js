// Import the LinkSphere SDK client we just created
const LinkSphereClient = require('./sdk/linksphere');

// Create a new instance of the client
// No config needed yet for discovering APIs
const client = new LinkSphereClient();

// Define an async function to run the example
async function runExample() {
  console.log('Attempting to discover APIs using LinkSphere SDK...');

  try {
    // Call the discoverApis method
    const apiData = await client.discoverApis();

    // Log the results
    console.log(`Successfully discovered ${apiData.count} APIs:`);

    // Print the names of the discovered APIs
    apiData.data.forEach(api => {
      console.log(`- ${api.name} (${api.category})`);
    });

  } catch (error) {
    // Log any errors encountered during the SDK call
    console.error('SDK Example Failed:', error.message);
  }
}

// Execute the example function
runExample();