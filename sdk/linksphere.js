// Import the axios library for making HTTP requests
const axios = require('axios');

// Define the base URL for the LinkSphere API server
const API_BASE_URL = 'http://localhost:3000'; // We might make this configurable later

/**
 * LinkSphere SDK Client Class (Basic MVP Version)
 */
class LinkSphereClient {
  constructor(config = {}) {
    this.apiKey = config.apiKey || null;
    this.baseUrl = config.baseUrl || API_BASE_URL;
  }

  /**
   * Fetches the list of available APIs from the LinkSphere Discovery Hub.
   * @returns {Promise<object>} A promise that resolves with the API catalog data.
   */
  async discoverApis() {
    try {
      const response = await axios.get(`${this.baseUrl}/apis`);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Failed to fetch APIs. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching APIs from LinkSphere:', error.message);
      if (error.response) {
        throw new Error(`LinkSphere API request failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
         throw new Error(`LinkSphere API request failed: No response received from ${this.baseUrl}. Is the server running?`);
      } else {
        throw new Error(`LinkSphere SDK error: ${error.message}`);
      }
    }
  }

  /**
   * Simulates calling a single API via the LinkSphere gateway (including security check).
   * This uses the /api/call-simulation endpoint for the MVP.
   * @param {object} callDetails - Details needed for the call.
   * @param {string} callDetails.apiId - The ID of the API to call.
   * @param {object} callDetails.params - Parameters for the API call.
   * @param {object} callDetails.userContext - Context about the user/caller.
   * @returns {Promise<object>} A promise resolving with the simulation result or rejecting on error/block.
   */
  async callApi(callDetails) {
     console.warn('[SDK] Note: callApi() currently uses the MVP simulation endpoint.');
     try {
         const response = await axios.post(`${this.baseUrl}/api/call-simulation`, callDetails);
         // The simulation endpoint returns 200 for success, 403 for blocked.
         // Axios throws for non-2xx statuses by default, which is handled in the catch block.
         return response.data; // Contains { status: 'success', ... }
     } catch (error) {
        console.error(`Error calling API ${callDetails.apiId} via LinkSphere:`, error.message);
        if (error.response && error.response.status === 403) {
             // Specifically handle the blocked case from the simulation endpoint
             console.error(`API call blocked by security policy: ${error.response.data.reason}`);
             throw new Error(`Blocked: ${error.response.data.reason}`); // Re-throw a simpler error
         } else if (error.response) {
             throw new Error(`LinkSphere API request failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
         } else if (error.request) {
             throw new Error(`LinkSphere API request failed: No response received from ${this.baseUrl}. Is the server running?`);
         } else {
             throw new Error(`LinkSphere SDK error: ${error.message}`);
         }
     }
  }


  /**
   * Simulates orchestrating a workflow (sequence of API calls) via LinkSphere.
   * Sends the workflow definition to the /api/orchestrate-simulation endpoint.
   * @param {object} workflow - The workflow definition.
   * @param {string} workflow.name - Name of the workflow.
   * @param {object[]} workflow.steps - An array of API call steps. Each step needs apiId, params.
   * @param {object} workflow.userContext - Context for the entire workflow execution.
   * @returns {Promise<object>} A promise resolving with the orchestration result.
   */
  async orchestrateWorkflow(workflow) {
    console.log(`[SDK] Attempting to orchestrate workflow: ${workflow.name}`);
    try {
      // Make a POST request to the new orchestration simulation endpoint
      const response = await axios.post(`${this.baseUrl}/api/orchestrate-simulation`, workflow);

      if (response.status === 200) {
        return response.data; // Contains { status: 'success'/'partial'/'failed', results: [...] }
      } else {
        // Should be caught by the catch block, but included for completeness
        throw new Error(`Failed to orchestrate workflow. Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error orchestrating workflow ${workflow.name}:`, error.message);
       if (error.response) {
            throw new Error(`LinkSphere Orchestration request failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            throw new Error(`LinkSphere Orchestration request failed: No response received from ${this.baseUrl}. Is the server running?`);
        } else {
            throw new Error(`LinkSphere SDK error: ${error.message}`);
        }
    }
  }

} // End of LinkSphereClient class

// Export the client class
module.exports = LinkSphereClient;