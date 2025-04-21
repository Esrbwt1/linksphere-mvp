// Import the axios library
const axios = require('axios');

// Base URL
const API_BASE_URL = 'http://localhost:3000';

/**
 * LinkSphere SDK Client Class (Now with API Key)
 */
class LinkSphereClient {
  /**
   * Creates an instance of the LinkSphere Client.
   * @param {object} config - Configuration object.
   * @param {string} [config.apiKey] - Your LinkSphere API Key. Required for protected operations.
   * @param {string} [config.baseUrl] - Optional base URL override.
   */
  constructor(config = {}) {
    this.apiKey = config.apiKey || null; // Store the API Key
    this.baseUrl = config.baseUrl || API_BASE_URL;

    // Create an Axios instance with default headers
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json'
        // We will add the API key header per-request if available
      }
    });
  }

  // --- Private method to get request headers ---
  _getHeaders() {
      const headers = {};
      if (this.apiKey) {
          headers['X-API-Key'] = this.apiKey;
      } else {
          console.warn('[SDK] Warning: API Key not provided to client. Protected calls may fail.');
      }
      return headers;
  }


  /**
   * Fetches the list of available APIs (Public endpoint - no key needed).
   * @returns {Promise<object>}
   */
  async discoverApis() {
    try {
      // Use the internal axios instance, no custom headers needed here
      const response = await this.axiosInstance.get('/apis');
      if (response.status === 200) { return response.data; }
      else { throw new Error(`Failed to fetch APIs. Status: ${response.status}`); }
    } catch (error) { /* ... keep existing error handling ... */
      console.error('Error fetching APIs:', error.message);
      if (error.response) { throw new Error(`API request failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`); }
      else if (error.request) { throw new Error(`API request failed: No response from ${this.baseUrl}. Server running?`); }
      else { throw new Error(`SDK error: ${error.message}`); }
    }
  }

  /**
   * Simulates calling a single API (Protected endpoint - needs key).
   * @param {object} callDetails - { apiId, params, userContext }
   * @returns {Promise<object>}
   */
  async callApi(callDetails) {
     console.warn('[SDK] Note: callApi() currently uses the MVP simulation endpoint.');
     try {
         // Use the internal axios instance and add the API Key header
         const response = await this.axiosInstance.post(`/api/call-simulation`, callDetails, {
             headers: this._getHeaders() // Add API key header if available
         });
         return response.data;
     } catch (error) { /* ... keep existing error handling, including 401/403 checks... */
        console.error(`Error calling API ${callDetails.apiId}:`, error.message);
         if (error.response && (error.response.status === 403 || error.response.status === 401)) {
             console.error(`API call failed (Auth): ${error.response.data.error}`);
             throw new Error(`Auth Failed: ${error.response.data.error}`);
         } else if (error.response) { throw new Error(`API request failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`); }
         else if (error.request) { throw new Error(`API request failed: No response from ${this.baseUrl}. Server running?`); }
         else { throw new Error(`SDK error: ${error.message}`); }
     }
  }


  /**
   * Simulates orchestrating a workflow (Protected endpoint - needs key).
   * @param {object} workflow - { name, steps, userContext }
   * @returns {Promise<object>}
   */
  async orchestrateWorkflow(workflow) {
    console.log(`[SDK] Attempting to orchestrate workflow: ${workflow.name}`);
    try {
       // Use the internal axios instance and add the API Key header
       const response = await this.axiosInstance.post(`/api/orchestrate-simulation`, workflow, {
           headers: this._getHeaders() // Add API key header if available
       });
       return response.data;
    } catch (error) { /* ... keep existing error handling ... */
       console.error(`Error orchestrating workflow ${workflow.name}:`, error.message);
       if (error.response && (error.response.status === 403 || error.response.status === 401)) {
             console.error(`Orchestration failed (Auth): ${error.response.data.error}`);
             throw new Error(`Auth Failed: ${error.response.data.error}`);
       } else if (error.response) { throw new Error(`Orchestration request failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`); }
       else if (error.request) { throw new Error(`Orchestration request failed: No response from ${this.baseUrl}. Server running?`); }
       else { throw new Error(`SDK error: ${error.message}`); }
    }
  }

} // End of LinkSphereClient class

// Export the client class
module.exports = LinkSphereClient;