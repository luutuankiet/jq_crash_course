# jq Playground - Master JSON Processing

This project is an interactive, browser-based playground for learning and experimenting with `jq`, the powerful command-line JSON processor. It provides a simple, intuitive interface to test `jq` filters against JSON data without needing to install the `jq` CLI locally.

**[Try the live demo!](https://luutuankiet.github.io/jq_crash_course/)**

## Features

- **Interactive Playground:** 
    - **Syntax Highlighting:** Read and edit JSON with ease.
    - **Flexible Input:** Paste raw text, fetch from a URL, or upload a JSON file.
    - **Live Filtering:** See results update instantly as you type your query.
- **Recipe Book:** A curated collection of 50+ real-world examples (Docker, Logs, APIs) to help you learn by doing.
- **Challenge Mode:** Test your skills! Hide the answers and try to solve the puzzles yourself with helpful hints.
- **Zero Installation:** Runs entirely in the browser using `jq-web`.

## Quick Start

1.  **Select a Recipe**: Browse the "Recipes" tab to find a use case like "Extract Error Logs".
2.  **Experiment**: Click "Run" to see the output. Modify the query in the Playground to see how it changes.
3.  **Challenge Yourself**: Toggle "Challenge Mode" to hide the query and try to reconstruct it from scratch!

## Local Development

This project was built with React and Vite.

**Prerequisites:** [Node.js](https://nodejs.org/) (version 20+) installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/luutuankiet/jq_crash_course.git
    cd jq_crash_course
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the local development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Testing

Run automated recipe tests to verify all 50+ recipes execute correctly:

```bash
npm run test
```

This will test all recipes and report any errors.

## Deployment

This application is configured for continuous deployment to GitHub Pages. Any push to the `main` branch will automatically trigger a build and deployment workflow.

## Credits

Made with Google AI Studio and Antigravity ❤️ [https://antigravity.google](https://antigravity.google)
