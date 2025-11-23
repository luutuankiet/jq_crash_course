import React, { useState, useEffect } from 'react';
import { AppView, Recipe } from './types';
import { SAMPLE_JSON } from './constants';
import { RECIPES } from './recipes';
import { executeJq, fetchJsonFromUrl, readFileContent, checkJqAvailable } from './services/jqService';
import { HomeView } from './components/HomeView';
import { useRecipeProgress } from './hooks/useRecipeProgress';
import isEqual from 'lodash/isEqual';
import * as Diff from 'diff';

// Syntax Highlighting
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';

// --- Icons ---
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const RecipeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
const TextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3" /><path d="M21 12.1H3" /><path d="M15.1 18H3" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
const ChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const ChevronUp = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>;
const SidebarLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const WrapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15l4 4 4-4" /><path d="M4 9l4-4 4 4" /><path d="M20 19H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

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

interface PlaygroundProps {
  initialJson?: string;
  initialQuery?: string;
  challengeMode?: boolean;
  expectedResult?: any;
  onToggleChallenge?: () => void;
  onChallengeComplete?: () => void;
  readOnly?: boolean;
}

const PlaygroundView: React.FC<PlaygroundProps> = ({
  initialJson,
  initialQuery,
  challengeMode,
  expectedResult,
  onToggleChallenge,
  onChallengeComplete,
  readOnly = false
}) => {
  const [inputMode, setInputMode] = useState<'text' | 'url' | 'file'>('text');
  const [jsonInput, setJsonInput] = useState(initialJson || JSON.stringify(SAMPLE_JSON, null, 2));
  const [query, setQuery] = useState(initialQuery || ".");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState("https://api.github.com/repos/jqlang/jq/commits?per_page=5");
  const [errorMsg, setErrorMsg] = useState("");
  const [isJqReady, setIsJqReady] = useState(false);
  const [wrapInput, setWrapInput] = useState(false);
  const [wrapOutput, setWrapOutput] = useState(false);
  const [headersInput, setHeadersInput] = useState("");
  const [showHeaders, setShowHeaders] = useState(false);
  const [challengeStatus, setChallengeStatus] = useState<'idle' | 'pass' | 'fail'>('idle');
  const [diffParts, setDiffParts] = useState<Diff.Change[] | null>(null);

  // Check for library availability periodically
  useEffect(() => {
    if (checkJqAvailable()) {
      setIsJqReady(true);
      return;
    }
    const interval = setInterval(() => {
      if (checkJqAvailable()) {
        setIsJqReady(true);
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Update internal state if props change
  useEffect(() => {
    if (initialJson !== undefined) setJsonInput(initialJson);
    if (initialQuery !== undefined) setQuery(initialQuery);
    setChallengeStatus('idle');
    setOutput("");
    setDiffParts(null);
  }, [initialJson, initialQuery]);

  const handleRun = async () => {
    setLoading(true);
    setErrorMsg("");
    setChallengeStatus('idle');
    setDiffParts(null);

    try {
      const result = await executeJq(jsonInput, query);
      setOutput(result);

      if (challengeMode && expectedResult !== undefined) {
        let isCorrect = false;
        try {
          const parsedResult = JSON.parse(result);
          if (isEqual(parsedResult, expectedResult)) {
            isCorrect = true;
          }
        } catch (e) {
          if (result.trim() === JSON.stringify(expectedResult)) {
            isCorrect = true;
          }
        }

        if (isCorrect) {
          setChallengeStatus('pass');
          onChallengeComplete?.();
        } else {
          setChallengeStatus('fail');
          // Compute Diff
          const expectedStr = JSON.stringify(expectedResult, null, 2);
          const diff = Diff.diffLines(expectedStr, result);
          setDiffParts(diff);
        }
      }
    } catch (err: any) {
      setOutput("");
      setErrorMsg(err.message || "Error executing jq");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (isJqReady && !loading) {
        handleRun();
      }
    }
  };

  const handleFetchUrl = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      let headers = {};
      if (headersInput.trim()) {
        try {
          headers = JSON.parse(headersInput);
        } catch (e) {
          throw new Error("Invalid headers JSON format");
        }
      }
      const data = await fetchJsonFromUrl(urlInput, headers);
      setJsonInput(data);
      setInputMode('text');
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
    <div className="flex flex-col h-full p-2 sm:p-4 gap-2 sm:gap-4 bg-gray-50" onKeyDown={handleKeyDown}>
      <div className="flex flex-col gap-2 bg-white p-2 sm:p-3 rounded-lg border border-gray-200 shadow-sm">
        {/* Top row: Title + Input Mode + Run */}
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 hidden sm:block">Playground</h2>
            <div className="flex bg-gray-100 rounded p-1 border border-gray-200">
              <button onClick={() => setInputMode('text')} className={`px-2 sm:px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${inputMode === 'text' ? 'bg-white text-jq-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                <TextIcon />
                <span className="hidden sm:inline">Text</span>
              </button>
              <button onClick={() => setInputMode('url')} className={`px-2 sm:px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${inputMode === 'url' ? 'bg-white text-jq-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                <GlobeIcon />
                <span className="hidden sm:inline">URL</span>
              </button>
              <button onClick={() => setInputMode('file')} className={`px-2 sm:px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${inputMode === 'file' ? 'bg-white text-jq-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                <UploadIcon />
                <span className="hidden sm:inline">File</span>
              </button>
            </div>
          </div>
          <button
            onClick={handleRun}
            disabled={loading || !isJqReady}
            className={`font-bold py-2 px-3 sm:px-4 rounded flex items-center gap-2 shadow-sm whitespace-nowrap ${loading || !isJqReady ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white'} text-sm sm:text-base`}
          >
            {loading ? <span className="hidden sm:inline">Processing...</span> : <><PlayIcon /> <span className="hidden sm:inline">{challengeMode ? 'Check' : 'Run'}</span></>}
          </button>
        </div>

        {/* Bottom row: Loading status + Challenge toggle + Hint */}
        <div className="flex justify-between items-center gap-2 text-xs">
          <div className="flex items-center gap-2">
            {!isJqReady && <span className="text-amber-600 animate-pulse font-medium">Loading...</span>}
            <span className="text-gray-400 hidden lg:inline">💡 Load JSON from URL or File!</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-gray-500 hidden md:inline">Cmd/Ctrl + Enter</span>
            {onToggleChallenge && (
              <div className="flex items-center gap-2" title="Hide answers and test your skills!">
                <label className="font-bold text-gray-500 cursor-pointer hidden sm:inline" onClick={onToggleChallenge}>Challenge</label>
                <div
                  className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${challengeMode ? 'bg-jq-blue' : 'bg-gray-300'}`}
                  onClick={onToggleChallenge}
                >
                  <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${challengeMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {challengeMode && (
        <>
          <div className={`p-3 rounded-lg border text-sm font-bold text-center transition-colors ${challengeStatus === 'pass' ? 'bg-green-100 border-green-300 text-green-800' :
            challengeStatus === 'fail' ? 'bg-red-100 border-red-300 text-red-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
            {challengeStatus === 'pass' && "🎉 Correct! Well done."}
            {challengeStatus === 'fail' && "❌ Not quite. Check the diff below."}
            {challengeStatus === 'idle' && "💪 Try to solve the challenge yourself!"}
          </div>
          {expectedResult !== undefined && (
            <details className="bg-blue-50 rounded-lg border-2 border-blue-400 overflow-hidden shadow-sm">
              <summary className="px-4 py-3 cursor-pointer hover:bg-blue-100 text-sm font-bold text-blue-900 flex items-center gap-2 transition-colors">
                <span>🎯</span> Expected Result <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded font-bold">click to reveal</span>
              </summary>
              <pre className="px-4 py-3 text-xs font-mono text-gray-800 overflow-x-auto bg-white border-t-2 border-blue-400">
                {JSON.stringify(expectedResult, null, 2)}
              </pre>
            </details>
          )}
        </>
      )}

      <div className="flex gap-2 sm:gap-4 items-center">
        <span className="font-mono text-jq-blue font-bold text-base sm:text-lg">jq</span>
        <div className={`flex-1 border border-gray-300 rounded focus-within:border-jq-blue focus-within:ring-1 focus-within:ring-jq-blue shadow-sm bg-white overflow-hidden query-editor`}>
          <Editor
            value={query}
            onValueChange={code => setQuery(code)}
            highlight={code => highlight(code, languages.js, 'javascript')}
            padding={12}
            placeholder="Type your jq query here... (multi-line supported)"
            className="font-mono text-sm"
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 14,
              backgroundColor: '#ffffff',
              minHeight: '80px',
            }}
            textareaClassName="focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-2 sm:gap-4 min-h-0">
        <div className="flex-1 md:w-1/2 flex flex-col min-h-0 relative">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Input JSON</label>
            {inputMode === 'text' && (
              <button onClick={() => setWrapInput(!wrapInput)} className={`text-xs flex items-center gap-1 ${wrapInput ? 'text-jq-blue font-bold' : 'text-gray-400'}`} title="Toggle Word Wrap">
                <WrapIcon /> Wrap
              </button>
            )}
          </div>

          {inputMode === 'text' && (
            <div className="flex-1 border border-gray-300 rounded shadow-sm bg-white relative min-h-[250px] md:min-h-0" style={{ overflow: wrapInput ? 'auto' : 'scroll' }}>
              <div className={wrapInput ? 'input-wrap-enabled' : 'input-wrap-disabled'}>
                <Editor
                  value={jsonInput}
                  onValueChange={readOnly ? () => { } : (code => setJsonInput(code))}
                  highlight={code => highlight(code, languages.json, 'json')}
                  padding={16}
                  className={`font-mono text-sm ${readOnly ? 'opacity-60' : ''}`}
                  style={{
                    fontFamily: '"Fira Code", "Fira Mono", monospace',
                    fontSize: 14,
                    backgroundColor: readOnly ? '#f9fafb' : '#ffffff',
                    cursor: readOnly ? 'not-allowed' : 'text'
                  }}
                  readOnly={readOnly}
                />
              </div>
            </div>
          )}

          {inputMode === 'url' && (
            <div className="flex-1 bg-white border border-gray-300 p-6 rounded flex flex-col gap-4 shadow-sm overflow-auto">
              <h3 className="text-lg font-bold text-gray-800">Fetch JSON from URL</h3>
              <div className="flex flex-col gap-3 w-full">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://api.example.com/data"
                  className="w-full bg-gray-50 border border-gray-300 p-2 rounded text-gray-800 text-sm focus:outline-none focus:border-jq-blue"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHeaders(!showHeaders)}
                    className="text-xs text-gray-600 hover:text-jq-blue flex items-center gap-1"
                  >
                    {showHeaders ? '▼' : '▶'} Custom Headers (optional)
                  </button>
                </div>
                {showHeaders && (
                  <textarea
                    value={headersInput}
                    onChange={(e) => setHeadersInput(e.target.value)}
                    placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                    className="w-full bg-gray-50 border border-gray-300 p-2 rounded text-gray-800 text-xs font-mono focus:outline-none focus:border-jq-blue"
                    rows={3}
                  />
                )}
                <button
                  onClick={handleFetchUrl}
                  disabled={loading}
                  className="bg-jq-blue hover:bg-jq-light px-4 py-2 rounded text-white font-bold w-full"
                >
                  {loading ? 'Fetching...' : 'Fetch'}
                </button>
              </div>
              <p className="text-xs text-gray-500">Note: CORS must be enabled on the target server.</p>
              {errorMsg && <p className="text-red-500 text-sm font-bold">{errorMsg}</p>}
            </div>
          )}

          {inputMode === 'file' && (
            <div className="flex-1 bg-white border border-gray-300 p-8 rounded flex flex-col items-center justify-center gap-4 border-dashed shadow-sm">
              <div className="text-gray-400"><UploadIcon /></div>
              <h3 className="text-lg font-bold text-gray-800">Upload JSON File</h3>
              <input type="file" accept=".json" onChange={handleFileUpload} className="text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-jq-blue file:text-white hover:file:bg-jq-light" />
              {errorMsg && <p className="text-red-500 text-sm font-bold">{errorMsg}</p>}
            </div>
          )}
        </div>

        <div className="flex-1 md:w-1/2 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Output Result</label>
            <button onClick={() => setWrapOutput(!wrapOutput)} className={`text-xs flex items-center gap-1 ${wrapOutput ? 'text-jq-blue font-bold' : 'text-gray-400'}`} title="Toggle Word Wrap">
              <WrapIcon /> Wrap
            </button>
          </div>

          <div className={`flex-1 bg-gray-900 border border-gray-300 text-green-400 font-mono text-sm p-4 rounded overflow-auto shadow-sm min-h-[250px] md:min-h-0 ${wrapOutput ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}>
            {output || (loading ? "Running jq..." : "// Output will appear here")}
          </div>

          {challengeMode && diffParts && (
            <div className="mt-4 flex-1 flex flex-col min-h-0">
              <label className="text-xs font-bold text-red-500 mb-2 uppercase tracking-wide">Diff (Expected vs Actual)</label>
              <div className="flex-1 bg-gray-50 border border-red-200 text-gray-800 font-mono text-xs p-4 rounded overflow-auto whitespace-pre shadow-sm min-h-[150px] md:min-h-0">
                {diffParts.map((part, index) => {
                  const color = part.added ? 'bg-green-100 text-green-800' :
                    part.removed ? 'bg-red-100 text-red-800' : 'text-gray-500';
                  const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
                  return (
                    <span key={index} className={`block ${color}`}>
                      {part.value.split('\n').filter(l => l).map(l => prefix + l).join('\n')}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface RecipeItemProps {
  recipe: Recipe;
  onLoad: (r: Recipe) => void;
  challengeMode: boolean;
  isSelected: boolean;
  isCompleted: boolean;
  onToggleComplete: (recipeId: string) => void;
  onCollapseMobile: () => void;
}

const RecipeItem: React.FC<RecipeItemProps> = ({ recipe, onLoad, challengeMode, isSelected, isCompleted, onToggleComplete, onCollapseMobile }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div id={`recipe-${recipe.id}`} className={`bg-white border border-gray-200 rounded p-4 hover:border-jq-light hover:shadow-md transition-all group shadow-sm ${isSelected ? 'recipe-card-selected' : ''} ${isCompleted ? 'recipe-card-completed' : ''}`}>
      <div className="flex justify-between items-start mb-2 cursor-pointer" onClick={() => onLoad(recipe)}>
        <div className="flex-1">
          <span className="text-[10px] font-bold text-jq-blue uppercase tracking-wide">{recipe.category}</span>
          <h3 className="text-sm font-bold text-gray-800 mt-1 group-hover:text-jq-blue">{recipe.title}</h3>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onLoad(recipe); onCollapseMobile(); }} className="text-jq-blue hover:text-jq-dark opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayIcon />
        </button>
      </div>

      <p className="text-gray-600 text-xs mb-3 cursor-pointer" onClick={() => onLoad(recipe)}>{recipe.description}</p>

      {!challengeMode && (
        <code className="block bg-gray-100 p-2 rounded text-jq-dark font-mono text-xs truncate border border-gray-200 mb-3 cursor-pointer" onClick={() => onLoad(recipe)}>
          {recipe.query}
        </code>
      )}

      <div className="border-t border-gray-100 pt-2 flex items-center justify-between gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-jq-blue flex-1"
        >
          <InfoIcon /> {expanded ? "Hide Explanation" : "Deep Dive"} {expanded ? <ChevronUp /> : <ChevronDown />}
        </button>

        {isSelected && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleComplete(recipe.id); }}
            className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${isCompleted ? 'bg-green-100 text-green-700 font-bold' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            <CheckIcon /> {isCompleted ? 'Done' : 'Mark Done'}
          </button>
        )}
      </div>

      {isSelected && (
        <div className="mt-3 md:hidden">
          <button
            onClick={(e) => { e.stopPropagation(); onCollapseMobile(); }}
            className="w-full bg-jq-blue text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm shadow-sm active:scale-95 transition-transform"
          >
            <CodeIcon /> Start Coding
          </button>
        </div>
      )}

      {expanded && (
        <div className="mt-2 space-y-2">
          <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-100 leading-relaxed">
            {recipe.narrative}
          </div>
          {challengeMode && recipe.hint && (
            <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded border border-amber-100 leading-relaxed">
              <strong>💡 Hint:</strong> {recipe.hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RecipeAndPlaygroundView: React.FC = () => {
  const [json, setJson] = useState(JSON.stringify(SAMPLE_JSON, null, 2));
  const [query, setQuery] = useState(".");
  const [challengeMode, setChallengeMode] = useState(false);
  const [expectedResult, setExpectedResult] = useState<any>(undefined);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const progress = useRecipeProgress();

  const loadRecipe = async (r: Recipe) => {
    setJson(r.input);
    setSelectedRecipeId(r.id);
    setCurrentRecipe(r);
    progress.markAsRead(r.id);

    if (challengeMode) {
      setQuery("."); // Reset query for challenge
      // Calculate expected result
      try {
        const result = await executeJq(r.input, r.query);
        setExpectedResult(JSON.parse(result));
      } catch (e) {
        console.error("Failed to calculate expected result", e);
        setExpectedResult(undefined);
      }
    } else {
      setQuery(r.query);
      setExpectedResult(undefined);
    }
  };

  // Recalculate expected result when toggling challenge mode ON
  React.useEffect(() => {
    if (challengeMode && currentRecipe && expectedResult === undefined) {
      executeJq(currentRecipe.input, currentRecipe.query)
        .then(result => setExpectedResult(JSON.parse(result)))
        .catch(() => setExpectedResult(undefined));
    } else if (!challengeMode) {
      setExpectedResult(undefined);
      if (currentRecipe) {
        setQuery(currentRecipe.query);
      }
    }
  }, [challengeMode]);

  const handleToggleChallenge = () => {
    setChallengeMode(prev => {
      const newMode = !prev;
      if (newMode && currentRecipe) {
        setQuery("."); // Reset query when enabling challenge mode
      }
      return newMode;
    });
  };

  const handleChallengeComplete = () => {
    if (selectedRecipeId && !progress.isCompleted(selectedRecipeId)) {
      progress.toggleCompleted(selectedRecipeId);
    }
  };

  const [category, setCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [progressFilter, setProgressFilter] = useState<'all' | 'new' | 'done'>('all');
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [mobileRecipesExpanded, setMobileRecipesExpanded] = useState(false);

  // Scroll selected recipe into view when expanding list on mobile
  useEffect(() => {
    if (mobileRecipesExpanded && selectedRecipeId) {
      setTimeout(() => {
        const el = document.getElementById(`recipe-${selectedRecipeId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [mobileRecipesExpanded, selectedRecipeId]);

  const categories = ["All", ...Array.from(new Set(RECIPES.map(r => r.category)))];

  const filteredRecipes = RECIPES.filter(r => {
    const matchesCategory = category === "All" || r.category === category;
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.query.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgress =
      progressFilter === 'all' ? true :
        progressFilter === 'new' ? !progress.isRead(r.id) :
          progressFilter === 'done' ? progress.isCompleted(r.id) : true;
    return matchesCategory && matchesSearch && matchesProgress;
  });

  const stats = progress.getStats();

  return (
    <div className="flex flex-col md:flex-row h-full bg-gray-50">
      {/* Left Pane: Recipes List - Collapsible on mobile */}
      <div className={`w-full md:w-1/3 md:min-w-[350px] border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 flex flex-col transition-all duration-300 ${mobileRecipesExpanded ? 'max-h-[60vh]' : 'max-h-12'} md:max-h-full overflow-hidden md:overflow-y-auto`}>
        {/* Mobile: Show compact header - Desktop: Full header */}
        <div className="md:hidden bg-jq-blue text-white p-3 font-bold flex justify-between items-center cursor-pointer shrink-0" onClick={() => setMobileRecipesExpanded(!mobileRecipesExpanded)}>
          <span>📚 Recipes ({filteredRecipes.length})</span>
          <span className="text-xs opacity-75">{mobileRecipesExpanded ? '▼ Collapse' : '▶ Expand'}</span>
        </div>
        <div className={`p-3 sm:p-4 border-b border-gray-200 bg-white space-y-3 ${mobileRecipesExpanded ? 'block' : 'hidden'} md:block overflow-y-auto md:overflow-visible`}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Recipe Book</h2>
            {stats.completed > 0 && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                {stats.completed} ✓
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setProgressFilter('all')}
              className={`flex-1 px-3 py-2 rounded text-xs font-bold transition-colors ${progressFilter === 'all' ? 'bg-jq-blue text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setProgressFilter('new')}
              className={`flex-1 px-3 py-2 rounded text-xs font-bold transition-colors ${progressFilter === 'new' ? 'bg-purple-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              New
            </button>
            <button
              onClick={() => setProgressFilter('done')}
              className={`flex-1 px-3 py-2 rounded text-xs font-bold transition-colors ${progressFilter === 'done' ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Done
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jq-blue focus:ring-1 focus:ring-jq-blue text-sm"
            />
            <div className="absolute right-3 top-2.5 text-gray-400">
              <SearchIcon />
            </div>
          </div>

          <details open={categoriesExpanded} onToggle={(e) => setCategoriesExpanded((e.target as HTMLDetailsElement).open)} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <summary className="px-3 py-2 cursor-pointer hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center justify-between">
              <span>Categories ({categories.length})</span>
              <span className="text-gray-400">{categoriesExpanded ? '▼' : '▶'}</span>
            </summary>
            <div className="flex gap-2 flex-wrap p-3 pt-2 max-h-32 overflow-y-auto">
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
          </details>
        </div>
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 ${mobileRecipesExpanded ? 'block' : 'hidden'} md:block`}>
          {filteredRecipes.map(recipe => (
            <RecipeItem
              key={recipe.id}
              recipe={recipe}
              onLoad={loadRecipe}
              challengeMode={challengeMode}
              isSelected={recipe.id === selectedRecipeId}
              isCompleted={progress.isCompleted(recipe.id)}
              onToggleComplete={progress.toggleCompleted}
              onCollapseMobile={() => setMobileRecipesExpanded(false)}
            />
          ))}
          {filteredRecipes.length === 0 && (
            <div className="text-center text-gray-400 py-8 text-sm">No recipes found matching your search.</div>
          )}
        </div>
      </div>

      {/* Right Pane: Playground */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <PlaygroundView
          initialJson={json}
          initialQuery={query}
          challengeMode={challengeMode}
          expectedResult={expectedResult}
          onToggleChallenge={handleToggleChallenge}
          onChallengeComplete={handleChallengeComplete}
          readOnly={true}
        />
      </div>
    </div>
  );
};

// --- Main App Shell ---

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close mobile sidebar when changing views
  const handleViewChange = (view: AppView) => {
    setCurrentView(view);
    setIsMobileSidebarOpen(false);
  };

  // Auto-collapse sidebar on mobile/tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
        setIsMobileSidebarOpen(false); // Close mobile sidebar on resize if it was open
      }
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME: return <HomeView onNavigate={handleViewChange} />;
      case AppView.MANUAL: return <ManualView />;
      case AppView.PLAYGROUND: return <PlaygroundView />;
      case AppView.RECIPES: return <RecipeAndPlaygroundView />;
      default: return <HomeView onNavigate={handleViewChange} />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50"
        aria-label="Toggle menu"
      >
        {isMobileSidebarOpen ? <XIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar Navigation */}
      <nav className={`
        ${isSidebarCollapsed ? 'w-16' : 'w-16 md:w-64'} 
        bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 transition-all duration-300 shadow-sm
        fixed md:relative h-full z-40
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className={`p-4 ${isSidebarCollapsed ? 'justify-center' : 'md:p-6 justify-center md:justify-start'} flex items-center gap-3 border-b border-gray-100`}>
            <div className="w-8 h-8 bg-jq-blue rounded flex items-center justify-center font-bold text-white shrink-0 cursor-pointer shadow-sm" onClick={() => handleViewChange(AppView.HOME)}>jq</div>
            {!isSidebarCollapsed && <span className="font-bold text-xl tracking-tight hidden md:block text-gray-800">Master</span>}
          </div>

          <div className="p-2 md:p-4 space-y-1 md:space-y-2">
            <NavButton icon={<HomeIcon />} label="Home" active={currentView === AppView.HOME} onClick={() => handleViewChange(AppView.HOME)} collapsed={isSidebarCollapsed} />
            <NavButton icon={<CodeIcon />} label="Playground" active={currentView === AppView.PLAYGROUND} onClick={() => handleViewChange(AppView.PLAYGROUND)} collapsed={isSidebarCollapsed} />
            <NavButton icon={<RecipeIcon />} label="Recipes" active={currentView === AppView.RECIPES} onClick={() => handleViewChange(AppView.RECIPES)} collapsed={isSidebarCollapsed} />
            <div className="border-t border-gray-100 my-2 mx-2"></div>
            <NavButton icon={<BookIcon />} label="Docs" active={currentView === AppView.MANUAL} onClick={() => handleViewChange(AppView.MANUAL)} collapsed={isSidebarCollapsed} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="mx-auto p-2 text-gray-400 hover:text-jq-blue transition-colors hidden md:block"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <SidebarLeftIcon />
          </button>

          {!isSidebarCollapsed && (
            <div className="p-4 text-xs text-gray-400 hidden md:block text-center border-t border-gray-100">
              <a
                href="https://github.com/luutuankiet/jq_crash_course"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-jq-blue transition-colors"
              >
                📦 Source on GitHub
              </a>
              <br />
              <span className="opacity-75">Built for the data community</span>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {renderView()}
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label, collapsed }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, collapsed?: boolean }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-center ${collapsed ? '' : 'md:justify-start'} gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${active
      ? 'bg-jq-blue text-white shadow-md shadow-blue-500/20'
      : 'text-gray-500 hover:bg-gray-100 hover:text-jq-blue'
      }`}
    title={label}
  >
    <span className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-jq-blue'}`}>{icon}</span>
    {!collapsed && <span className="font-medium hidden md:block">{label}</span>}
  </button>
);

// Expose test runner
import { runRecipeTests } from './services/testRunner';
(window as any).runRecipeTests = runRecipeTests;

export default App;
