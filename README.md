# LinkSphere MVP

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Placeholder badge -->

**LinkSphere: The Universal Backbone of the API Economy (MVP Phase)**

This repository contains the Minimum Viable Product (MVP) for LinkSphere, an open-source, AI-powered API orchestration platform designed to simplify, secure, and monetize API connections.

**Warning:** This is early-stage development code (MVP Phase 1). It is NOT production-ready.

## Core MVP Features (Current)

*   **API Server (Node.js/Express):**
    *   Serves a basic API catalog at `/apis`.
    *   Includes a placeholder endpoint `/api/call-simulation` to demonstrate security flow.
*   **In-Memory API Catalog:** Contains definitions for a few sample APIs (Stripe, Twilio, Google Maps).
*   **Basic SDK (`sdk/linksphere.js`):**
    *   Provides a `discoverApis()` method to fetch the catalog from the server.
*   **Placeholder AI Security:** A simple function in `server.js` (`aiSecurityPlaceholder`) simulates risk analysis on the `/api/call-simulation` endpoint.
*   **Version Control:** Managed with Git and hosted publicly on GitHub.

## Technology Stack (MVP)

*   Backend: Node.js, Express.js
*   SDK Client: Node.js, Axios
*   Database: None (In-Memory Array for API Catalog)
*   AI: Placeholder function (No actual LLM integrated yet)
*   Version Control: Git, GitHub

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended, includes npm)
*   [Git](https://git-scm.com/)
*   [curl](https://curl.se/download.html) (for testing POST endpoints, often included with Git or OS)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Esrbwt1/linksphere-mvp.git
    cd linksphere-mvp
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the API Server

1.  **Start the server:**
    ```bash
    node src/server.js
    ```
2.  The server will be running at `http://localhost:3000`.
3.  You can access the following endpoints in your browser or using `curl`:
    *   `http://localhost:3000/` (Root message)
    *   `http://localhost:3000/apis` (GET API Catalog)
    *   `http://localhost:3000/api/call-simulation` (POST - see testing below)

### Running the SDK Example

1.  **Ensure the API Server is running** (see previous section).
2.  Open a **second terminal** in the project directory.
3.  **Run the example script:**
    ```bash
    node example-usage.js
    ```
4.  This will use the SDK to call the running server's `/apis` endpoint and print the results.

### Testing the API Call Simulation Endpoint (using curl)

1.  **Ensure the API Server is running.**
2.  Open a **second terminal.**
3.  **Test Case 1 (Success):**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"apiId": "stripe-v1", "params": {"amount": 1000, "currency": "usd"}, "userContext": {"userId": "user123", "location": "KnownLocation"}}' http://localhost:3000/api/call-simulation
    ```
4.  **Test Case 2 (Risky - Missing Param):**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"apiId": "stripe-v1", "params": {"currency": "usd"}, "userContext": {"userId": "user123", "location": "KnownLocation"}}' http://localhost:3000/api/call-simulation
    ```
5.  **Test Case 3 (Blocked - High Risk):**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"apiId": "stripe-v1", "params": {"currency": "usd"}, "userContext": {"userId": "user456", "location": "UnusualLocation"}}' http://localhost:3000/api/call-simulation
    ```
6.  Observe the JSON output in the `curl` terminal and the log messages in the server terminal.

## Next Steps (MVP Roadmap - High Level)

*   Refine API data structures.
*   Implement basic SDK orchestration placeholder.
*   Integrate actual (free tier) LLM for basic AI analysis.
*   Set up basic database connection (e.g., MongoDB Atlas free tier).
*   Develop front-end for Discovery Hub.
*   Containerize using Docker.
*   Set up CI/CD pipeline (GitHub Actions).

## Contributing

This project is currently in the very early stages. Contributions are welcome once the basic structure is more stable. Please adhere to standard open-source practices. (Placeholder - will refine later).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (We will add a LICENSE file later).