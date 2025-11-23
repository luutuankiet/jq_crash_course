// Type definition for the global jq object provided by the script
declare global {
  interface Window {
    jq: {
      json: (json: any, filter: string) => Promise<any>;
    };
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const checkJqAvailable = (): boolean => {
  return !!(window && window.jq);
};

export const executeJq = async (jsonInput: string, filter: string): Promise<string> => {
  // Retry mechanism for initialization race conditions
  // ASM.js version can take a bit longer to parse and initialize
  if (!window.jq) {
    let retries = 0;
    // Try for about 10 seconds (50 * 200ms)
    while (retries < 50) {
      if (window.jq) break;
      await sleep(200);
      retries++;
    }
  }

  if (!window.jq) {
    return "Error: jq library not loaded.\n\nPossible causes:\n1. CDN (unpkg.com) is blocked or slow.\n2. Internet connection is unstable.\n\nPlease check your browser console for script loading errors and refresh the page.";
  }

  if (!filter.trim()) return jsonInput;

  try {
    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonInput);
    } catch (e) {
      return "Error: Invalid JSON Input.";
    }

    // jq-web expects a JS object and a filter string
    // It returns a promise that resolves to the result
    const result = await window.jq.json(parsedJson, filter);
    
    // jq-web result formatting
    return JSON.stringify(result, null, 2);
  } catch (error: any) {
    // jq-web errors handling
    return `jq Error: ${error.message || error}`;
  }
};

export const fetchJsonFromUrl = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Status: ${response.status}`);
    }
    const data = await response.json();
    return JSON.stringify(data, null, 2);
  } catch (error: any) {
    throw new Error(`Failed to fetch: ${error.message}`);
  }
};

export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};
