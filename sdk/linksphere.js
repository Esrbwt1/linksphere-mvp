// Import the axios library for making HTTP requests
const axios = require('axios');

// Define the base URL for the LinkSphere API server
// For local development, this points to our running server
const API_BASE_URL = 'http://localhost:3000'; // We might make this configurable later

/**
 * LinkSphere SDK Client Class (Basic MVP Version)
 */
class LinkSphereClient {
  constructor(config = {}) {
    // Placeholder for future configuration (e.g., API keys)
    this.apiKey = config.apiKey || null;
    this.baseUrl = config.baseUrl || API_BASE_URL;
  }

  /**
   * Fetches the list of available APIs from the LinkSphere Discovery Hub.
   * @returns {Promise<object>} A promise that resolves with the API catalog data.
   * @throws {Error} Throws an error if the request fails.
   */
  async discoverApis() {
    try {
      // Make a GET request to the /apis endpoint
      const response = await axios.get(`${this.baseUrl}/apis`);

      // Check if the response status is OK (200)
      if (response.status === 200) {
        // Return the data part of the response (which contains count and data array)
        return response.data;
      } else {
        // Throw an error if the status code is not 200
        throw new Error(`Failed to fetch APIs. Status: ${response.status}`);
      }
    } catch (error) {
      // Log the error and re-throw a more specific error
      console.error('Error fetching APIs from LinkSphere:', error.message);
      if (error.response) {
        // Include server error details if available
        throw new Error(`LinkSphere API request failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // Handle cases where the request was made but no response received (e.g., server down)
         throw new Error(`LinkSphere API request failed: No response received from ${this.baseUrl}. Is the server running?`);
      } else {
        // Handle other errors (e.g., setup issues)
        throw new Error(`LinkSphere SDK error: ${error.message}`);
      }
    }
  }

  // --- Placeholder for future SDK methods ---
  // async callApi(apiId, method, params) { ... }
  // async orchestrate(workflow) { ... }
  // --- End Placeholder ---

} // End of LinkSphereClient class

// Export the client class to be used by other modules
module.exports = LinkSphereClient;