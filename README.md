<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# jq Playground - An Interactive Web-Based jq Processor

This project is an interactive, browser-based playground for learning and experimenting with `jq`, the powerful command-line JSON processor. It provides a simple, intuitive interface to test `jq` filters against JSON data without needing to install the `jq` CLI locally.

**[Try the live demo!](https://luutuankiet.github.io/jq_crash_course/)**

## Features

- **Live Filtering:** See the results of your `jq` filters update in real-time as you type.
- **Sample Data:** Comes pre-loaded with sample JSON to get you started quickly.
- **Clear Error Handling:** Displays user-friendly error messages for invalid JSON or incorrect `jq` syntax.
- **Zero Installation:** Runs entirely in the browser, making it a frictionless tool for learning and quick lookups.

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
    The application will be available at `http://localhost:5173` (or the next available port).

## Deployment

This application is configured for continuous deployment to GitHub Pages. Any push to the `main` branch will automatically trigger a build and deployment workflow.
