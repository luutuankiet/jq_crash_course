import { RECIPE_DEFINITIONS } from '../recipes';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import the helper function

// --- 1. Define Paths (ESM Compatible) ---
// In ES Modules, __dirname is not available. We use import.meta.url to get the current file's path.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The rest of the logic remains the same.
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = PROJECT_ROOT;
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'compiled-questions.json');

// --- 2. The Main Function ---
function main() {
  console.log(`Found \${RECIPE_DEFINITIONS.length} recipes to process.`);

  // Ensure the output directory exists.
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log(`Creating output directory: \${OUTPUT_DIR}`);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // --- 3. Convert and Write Data ---
  const jsonData = JSON.stringify(RECIPE_DEFINITIONS, null, 2);

  try {
    fs.writeFileSync(OUTPUT_FILE, jsonData, 'utf-8');
    console.log(`✅ Successfully wrote \${RECIPE_DEFINITIONS.length} recipes.`);
  } catch (error) {
    console.error('❌ Failed to write the question bank file:');
    console.error(error);
    process.exit(1);
  }
}

// --- 4. Run the Script ---
main();