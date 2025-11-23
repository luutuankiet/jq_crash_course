# jq Master 🎯

**Master JSON processing in your browser. Zero install, 100% practical.**

*Made with ❤️ using Google AI Studio and Antigravity  [https://antigravity.google](https://antigravity.google)*

<video src="https://github.com/user-attachments/assets/05f5089e-8bb5-479d-b88c-0b4684912c0a" controls autoplay loop muted width="100%"></video>
**[→ Try it live](https://luutuankiet.github.io/jq_crash_course/)**

---

## Why This Exists

If you've ever wrestled with JSON in the terminal, you know `jq` is incredibly powerful—and sometimes intimidating. 

This playground was built to bridge that gap. Whether you're a data engineer debugging pipeline outputs, an analytics engineer transforming API responses, or a developer just trying to parse some deeply nested JSON, you shouldn't need to fight with syntax.

**The goal:** Make `jq` accessible, learnable, and actually fun to use. Because JSON is everywhere, and knowing how to wrangle it efficiently is a superpower.

---

## What You Get

### 🎮 Interactive Playground
- **Live Code Editor**: Write `jq` queries and see results update in real-time
- **Syntax Highlighting**: Easy-to-read JSON and query syntax
- **Flexible Input**: Paste JSON, fetch from URLs (with custom headers!), or upload files
- **Word Wrap & Scroll**: Because not all JSON fits nicely on one screen

### 📚 100+ Real-World Recipes
We're not talking toy examples. These are patterns you'll actually use:
- **Docker** container inspection and log parsing
- **Cloud APIs** (AWS, GitHub, Stripe) response handling
- **Log Analysis** with multiple severity levels and timestamps
- **Data Transformation** for analytics pipelines
- **GenAI & ML** token counting and tool call parsing

Each recipe includes:
- **Context**: When and why you'd use this pattern
- **Hints**: Gentle nudges if you're stuck
- **Progress Tracking**: See what you've mastered

### 🔌 API-First Design
- Fetch JSON from any URL (public or private)
- **Custom Headers**: Add Bearer tokens, API keys, whatever you need
- Works just like Postman, but with `jq` superpowers built in

### 🏆 Challenge Mode
Think you know `jq`? Hide the solutions and test yourself:
- **Git-diff style feedback**: See exactly what's different
- **Track your progress**: Comes back to haunt you (or celebrate) later

### 📖 Integrated Docs
The [official jq manual](https://jqlang.org/manual/) loads right in the app. No more tab-switching during those late-night debugging sessions.

---

## Quick Start

**Just want to jump in?**

1. **[Open the playground](https://luutuankiet.github.io/jq_crash_course/)**
2. **Pick a recipe** from the Recipe Book (start with "Basics: Navigation & Extraction")
3. **Click "Run"** to see it work
4. **Modify the query** and watch the output change
5. **Hit "Challenge Mode"** when you're feeling brave

---

## Running Locally

Want to hack on this or run it offline?

```bash
# Clone it
git clone https://github.com/luutuankiet/jq_crash_course.git
cd jq_crash_course

# Install dependencies (Node 20+ required)
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173` and you're off to the races.

**Test all recipes:**
```bash
npm run test
```

---

## Contributing Back

This project is a contribution to the data engineering, analytics engineering, and developer communities. JSON is the lingua franca of modern data systems, and `jq` is one of the most powerful tools for working with it.

If you find this useful:
- **Star the repo** on [GitHub](https://github.com/luutuankiet/jq_crash_course)
- **Share it** with colleagues fighting JSON battles
- **Contribute recipes** for your favorite APIs or data sources
- **File issues** if something breaks or could be better

We're all in this together. Let's make JSON processing less painful for everyone.

---

## Tech Stack

- **React + Vite** for the UI
- **jq-web** for client-side `jq` execution (yes, it runs in your browser!)
- **Tailwind CSS** for styling
- **GitHub Pages** for hosting

Zero backend. Zero tracking. Just you and your JSON.

---

## License & Credits

Built with ❤️ by developers, for developers.

Special thanks to the `jq` maintainers and the `jq-web` project for making this possible.

---

**Now go conquer some JSON.** 🚀
