import React, { useState, useEffect } from 'react';
import { AppView, Recipe } from './types';
import { GLOSSARY, SAMPLE_JSON } from './constants';
import { RECIPES } from './recipes';
import { executeJq, fetchJsonFromUrl, readFileContent, checkJqAvailable } from './services/jqService';

// --- Icons ---
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const GlossaryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const RecipeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const TextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const ChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const ChevronUp = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>;

// --- Components ---

const ManualView = () => {
  return (
    <div className="h-full w-full bg-white">
      <iframe 
        src="https://jqlang.org/manual/" 
        title="jq Manual"
        className="w-full h-full border-0"
      />
    </div>
  );
};

const GlossaryView = () => {
  const [filter, setFilter] = useState("");
  const terms = GLOSSARY.filter(t => t.term.toLowerCase().includes(filter.toLowerCase()) || t.definition.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="p-6 h-full overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Glossary</h2>
        <input 
          type="text" 
          placeholder="Search terms..." 
          className="w-full bg-white border border-gray-300 text-gray-800 p-4 rounded-lg mb-8 focus:ring-2 focus:ring-jq-blue focus:outline-none shadow-sm"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {terms.map((term, i) => (
            <div key={i} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:border-jq-light transition-all group">
              <h3 className="text-xl font-mono font-bold text-jq-blue mb-2">{term.term}</h3>
              <p className="text-gray-600 leading-relaxed">{term.definition}</p>
            </div>
          ))}
          {terms.length === 0 && <p className="text-gray-500 text-center col-span-2">No terms found.</p>}
        </div>
      </div>
    </div>
  );
};

interface PlaygroundProps {
  initialJson?: string;
  initialQuery?: string;
}

const PlaygroundView: React.FC<PlaygroundProps> = ({ initialJson, initialQuery }) => {
  const [inputMode, setInputMode] = useState<'text' | 'url' | 'file'>('text');
  const [jsonInput, setJsonInput] = useState(initialJson || JSON.stringify(SAMPLE_JSON, null, 2));
  const [query, setQuery] = useState(initialQuery || ".");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState("https://api.github.com/repos/jqlang/jq/commits?per_page=5");
  const [errorMsg, setErrorMsg] = useState("");
  const [isJqReady, setIsJqReady] = useState(false);

  // Check for library availability periodically
  useEffect(() => {
    // Immediate check
    if (checkJqAvailable()) {
      setIsJqReady(true);
      return;
    }

    // Polling check
    const interval = setInterval(() => {
      if (checkJqAvailable()) {
        setIsJqReady(true);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Update internal state if props change (loading from recipe/tutorial)
  useEffect(() => {
    if (initialJson !== undefined) setJsonInput(initialJson);
    if (initialQuery !== undefined) setQuery(initialQuery);
  }, [initialJson, initialQuery]);

  const handleRun = async () => {
    setLoading(true);
    setErrorMsg("");
    const result = await executeJq(jsonInput, query);
    setOutput(result);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (isJqReady && !loading) {
        handleRun();
      }
    }
  };

  const handleFetchUrl = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await fetchJsonFromUrl(urlInput);
      setJsonInput(data);
      setInputMode('text'); // Switch back to text view to show the result
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      setErrorMsg("");
      try {
        const content = await readFileContent(e.target.files[0]);
        setJsonInput(content);
        setInputMode('text');
      } catch (err: any) {
        setErrorMsg("Failed to read file");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4 bg-gray-50">
      <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
           <h2 className="text-xl font-bold text-gray-800 hidden md:block">Playground</h2>
           <div className="flex bg-gray-100 rounded p-1 border border-gray-200">
             <button 
               onClick={() => setInputMode('text')} 
               className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-2 ${inputMode === 'text' ? 'bg-white text-jq-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
             >
               <TextIcon /> Text
             </button>
             <button 
               onClick={() => setInputMode('url')} 
               className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-2 ${inputMode === 'url' ? 'bg-white text-jq-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
             >
               <GlobeIcon /> URL
             </button>
             <button 
               onClick={() => setInputMode('file')} 
               className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-2 ${inputMode === 'file' ? 'bg-white text-jq-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
             >
               <UploadIcon /> File
             </button>
           </div>
        </div>
        <div className="flex items-center gap-4">
           {!isJqReady && <span className="text-xs text-amber-600 animate-pulse font-medium">Loading jq engine...</span>}
           <span className="text-xs text-gray-500 hidden md:inline">Ctrl + Enter to run</span>
           <button 
             onClick={handleRun}
             disabled={loading || !isJqReady}
             className={`font-bold py-2 px-4 rounded flex items-center gap-2 shadow-sm ${loading || !isJqReady ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white'}`}
           >
             {loading ? 'Processing...' : <><PlayIcon /> Run</>}
           </button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
         <span className="font-mono text-jq-blue font-bold text-lg">jq</span>
         <input 
           type="text" 
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           onKeyDown={handleKeyDown}
           className="flex-1 bg-white border border-gray-300 text-gray-900 font-mono p-3 rounded focus:border-jq-blue focus:ring-1 focus:ring-jq-blue focus:outline-none text-lg shadow-sm"
           placeholder=". | select(.id == 1)"
         />
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        <div className="flex-1 flex flex-col min-h-0 relative">
          <label className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Input JSON</label>
          
          {inputMode === 'text' && (
            <textarea 
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="flex-1 bg-white border border-gray-300 text-gray-800 font-mono text-sm p-4 rounded resize-none focus:border-jq-light focus:outline-none leading-relaxed shadow-sm"
              spellCheck={false}
              placeholder='{"key": "value"}'
            />
          )}

          {inputMode === 'url' && (
             <div className="flex-1 bg-white border border-gray-300 p-8 rounded flex flex-col items-center justify-center gap-4 shadow-sm">
               <h3 className="text-lg font-bold text-gray-800">Fetch JSON from URL</h3>
               <div className="flex w-full max-w-lg gap-2">
                 <input 
                    type="text" 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-300 p-2 rounded text-gray-800 focus:outline-none focus:border-jq-blue" 
                 />
                 <button onClick={handleFetchUrl} disabled={loading} className="bg-jq-blue hover:bg-jq-light px-4 rounded text-white font-bold">Fetch</button>
               </div>
               <p className="text-xs text-gray-500">Note: CORS must be enabled on the target server.</p>
               {errorMsg && <p className="text-red-500 text-sm font-bold">{errorMsg}</p>}
             </div>
          )}

          {inputMode === 'file' && (
             <div className="flex-1 bg-white border border-gray-300 p-8 rounded flex flex-col items-center justify-center gap-4 border-dashed shadow-sm">
               <div className="text-gray-400">
                 <UploadIcon />
               </div>
               <h3 className="text-lg font-bold text-gray-800">Upload JSON File</h3>
               <input type="file" accept=".json" onChange={handleFileUpload} className="text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-jq-blue file:text-white hover:file:bg-jq-light" />
               {errorMsg && <p className="text-red-500 text-sm font-bold">{errorMsg}</p>}
             </div>
          )}

        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <label className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Output Result</label>
          {/* Keeping output dark for terminal feel */}
          <div className="flex-1 bg-gray-900 border border-gray-300 text-green-400 font-mono text-sm p-4 rounded overflow-auto whitespace-pre-wrap shadow-sm">
            {output || (loading ? "Running jq..." : "// Output will appear here")}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for a single recipe item
const RecipeItem: React.FC<{ recipe: Recipe; onLoad: (r: Recipe) => void }> = ({ recipe, onLoad }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className="bg-white border border-gray-200 rounded p-4 hover:border-jq-light hover:shadow-md transition-all group shadow-sm"
    >
        <div className="flex justify-between items-start mb-2 cursor-pointer" onClick={() => onLoad(recipe)}>
          <div>
            <span className="text-[10px] font-bold text-jq-blue uppercase tracking-wide">{recipe.category}</span>
            <h3 className="text-sm font-bold text-gray-800 mt-1 group-hover:text-jq-blue">{recipe.title}</h3>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onLoad(recipe); }} className="text-jq-blue hover:text-jq-dark opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayIcon />
          </button>
        </div>
        
        <p className="text-gray-600 text-xs mb-3 cursor-pointer" onClick={() => onLoad(recipe)}>{recipe.description}</p>
        
        <code className="block bg-gray-100 p-2 rounded text-jq-dark font-mono text-xs truncate border border-gray-200 mb-3 cursor-pointer" onClick={() => onLoad(recipe)}>
          {recipe.query}
        </code>

        <div className="border-t border-gray-100 pt-2">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-jq-blue w-full"
          >
             <InfoIcon /> {expanded ? "Hide Explanation" : "Deep Dive"} {expanded ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expanded && (
             <div className="mt-2 text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-100 leading-relaxed">
               {recipe.narrative}
             </div>
          )}
        </div>
    </div>
  );
};

const RecipeAndPlaygroundView: React.FC = () => {
  // Shared state between recipe list and playground
  const [json, setJson] = useState(JSON.stringify(SAMPLE_JSON, null, 2));
  const [query, setQuery] = useState(".");

  const loadRecipe = (r: Recipe) => {
    setJson(r.input);
    setQuery(r.query);
  };

  const [category, setCategory] = useState<string>("All");
  const categories = ["All", ...Array.from(new Set(RECIPES.map(r => r.category)))];
  const filteredRecipes = category === "All" ? RECIPES : RECIPES.filter(r => r.category === category);

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Pane: Recipes List */}
      <div className="w-1/3 min-w-[350px] border-r border-gray-200 bg-gray-50 flex flex-col">
         <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Recipe Book</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${category === c ? 'bg-jq-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                >
                  {c}
                </button>
              ))}
            </div>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {filteredRecipes.map(recipe => (
              <RecipeItem key={recipe.id} recipe={recipe} onLoad={loadRecipe} />
            ))}
         </div>
      </div>

      {/* Right Pane: Playground */}
      <div className="flex-1 min-w-0">
        <PlaygroundView initialJson={json} initialQuery={query} />
      </div>
    </div>
  );
};

// --- Main App Shell ---

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.PLAYGROUND);

  const renderView = () => {
    switch(view) {
      case AppView.MANUAL: return <ManualView />;
      case AppView.GLOSSARY: return <GlossaryView />;
      case AppView.PLAYGROUND: return <PlaygroundView />;
      case AppView.RECIPES: return <RecipeAndPlaygroundView />;
      default: return <PlaygroundView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar Navigation */}
      <nav className="w-16 md:w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 transition-all z-10 shadow-sm">
        <div>
          <div className="p-4 md:p-6 flex items-center gap-3 border-b border-gray-100 justify-center md:justify-start">
            <div className="w-8 h-8 bg-jq-blue rounded flex items-center justify-center font-bold text-white shrink-0 cursor-pointer shadow-sm" onClick={() => setView(AppView.PLAYGROUND)}>jq</div>
            <span className="font-bold text-xl tracking-tight hidden md:block text-gray-800">Master</span>
          </div>

          <div className="p-2 md:p-4 space-y-1 md:space-y-2">
            <NavButton 
              active={view === AppView.PLAYGROUND} 
              onClick={() => setView(AppView.PLAYGROUND)} 
              icon={<CodeIcon />} 
              label="Playground" 
            />
             <NavButton 
              active={view === AppView.RECIPES} 
              onClick={() => setView(AppView.RECIPES)} 
              icon={<RecipeIcon />} 
              label="Recipes" 
            />
            <div className="border-t border-gray-100 my-2 mx-2"></div>
            <NavButton 
              active={view === AppView.MANUAL} 
              onClick={() => setView(AppView.MANUAL)} 
              icon={<BookIcon />} 
              label="Manual" 
            />
            <NavButton 
              active={view === AppView.GLOSSARY} 
              onClick={() => setView(AppView.GLOSSARY)} 
              icon={<GlossaryIcon />} 
              label="Glossary" 
            />
          </div>
        </div>
        
        <div className="p-4 text-xs text-gray-400 hidden md:block text-center border-t border-gray-100">
          jq 1.8 Study App
          <br/>
          <span className="opacity-75">Client-side processing</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {renderView()}
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
      active 
        ? 'bg-jq-blue text-white shadow-md shadow-blue-500/20' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-jq-blue'
    }`}
    title={label}
  >
    <span className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-jq-blue'}`}>{icon}</span>
    <span className="font-medium hidden md:block">{label}</span>
  </button>
);

export default App;
