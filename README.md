# AI-Powered Text Formatter

## Overview
A lightweight, client-side web application that integrates directly with the Gemini API to dynamically format and enhance text. This project demonstrates asynchronous API communication, JSON payload parsing, and resilient client-side error handling.

## Architecture & Technologies
* **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
* **Integration:** REST API via the `fetch` interface
* **Data Format:** JSON

## Key Features
* **Asynchronous Networking:** Utilizes non-blocking `async/await` patterns to maintain a responsive UI during external network calls.
* **Dynamic DOM Injection:** Parses complex, nested JSON responses from the API and safely injects the sanitized data back into the document object model.
* **Infrastructure Resilience:** Includes specific error-handling routines for HTTP 429 (Too Many Requests) to provide graceful degradation when free-tier API rate limits are exceeded.

## Setup Instructions
To run this project locally:
1. Clone the repository.
2. Open `app.js` and replace the `API_KEY` placeholder with a valid Gemini API key from Google AI Studio.
3. Open `index.html` in any modern web browser. No local server or build step is required.
