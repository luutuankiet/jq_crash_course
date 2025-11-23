// Type definition for the global jq object provided by the script
declare global {
  interface Window {
    // The global jq object is a promise that resolves to the API
    jq: Promise<{
      json: (json: any, filter: string) => Promise<any>;
      raw: (json: string, filter: string) => Promise<string>;
    }>;
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const checkJqAvailable = (): boolean => {
  return !!(window && window.jq);
};

export const executeJq = async (jsonInput: string, filter: string): Promise<string> => {
  // The jq-web library initializes asynchronously. We must await the promise.

  // The retry logic is no longer needed, we can await the promise directly.

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
    const jqApi = await window.jq;
    const result = await jqApi.json(parsedJson, filter);
    
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
