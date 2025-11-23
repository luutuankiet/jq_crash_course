import React from 'react';
import { AppView } from '../types';

interface HomeViewProps {
    onNavigate: (view: AppView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {

    return (
        <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Hero Section */}
                <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 text-center space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-jq-blue opacity-5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-jq-accent opacity-5 rounded-full -ml-24 -mb-24"></div>

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-jq-blue to-jq-dark rounded-2xl flex items-center justify-center text-4xl font-bold text-white mx-auto shadow-xl transform hover:scale-105 transition-transform">
                            jq
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mt-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-jq-blue">
                            Master JSON Processing
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mt-4">
                            The interactive, visual guide to learning <code className="font-mono bg-gray-100 px-2 py-1 rounded text-jq-blue">jq</code>.
                            <br />
                            From basic filters to advanced data engineering pipelines.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                            <button
                                onClick={() => onNavigate(AppView.RECIPES)}
                                className="px-10 py-4 bg-gradient-to-r from-jq-blue to-jq-dark hover:shadow-2xl text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-3"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                                Start Learning
                            </button>
                            <button
                                onClick={() => onNavigate(AppView.PLAYGROUND)}
                                className="px-10 py-4 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-jq-blue rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-3"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                Playground
                            </button>
                            <button
                                onClick={() => onNavigate(AppView.MANUAL)}
                                className="px-10 py-4 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-jq-blue rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-3"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                                Manual
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-md hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">🎮</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-3">Interactive Learning</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Challenge Mode lets you test your skills. Get instant feedback with visual diffs.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-purple-100 shadow-md hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">✨</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-3">Syntax Highlighting</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Beautiful code highlighting for both jq queries and JSON data.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-green-100 shadow-md hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl">📊</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-3">Real-World Examples</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            50+ curated recipes from DevOps logs to data engineering pipelines.
                        </p>
                    </div>
                </div>

                {/* Who is this for? */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Who is this for?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                            <h3 className="font-bold text-jq-dark mb-3 flex items-center gap-2 text-lg">
                                <span className="bg-blue-200 p-2 rounded-lg">🚀</span> DevOps & SRE
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Parse Docker inspect logs, Kubernetes manifests, and AWS CLI outputs with ease.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                            <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2 text-lg">
                                <span className="bg-purple-200 p-2 rounded-lg">📊</span> Data Engineers
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Transform BigQuery JSON exports, flatten nested structures, and prepare data for CSV/SQL.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                            <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-lg">
                                <span className="bg-green-200 p-2 rounded-lg">🤖</span> AI Developers
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Extract prompts, analyze token usage, and debug complex LLM trace logs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Start */}
                <div className="bg-gradient-to-r from-jq-blue to-jq-dark rounded-2xl p-8 shadow-xl text-white">
                    <h2 className="text-3xl font-extrabold mb-4">Quick Start</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Try the Playground</h3>
                                <p className="text-blue-100 text-sm">Test queries interactively with instant feedback</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Explore Recipes</h3>
                                <p className="text-blue-100 text-sm">Browse 50+ real-world examples organized by category</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Enable Challenge Mode</h3>
                                <p className="text-blue-100 text-sm">Test yourself! Solve problems without seeing the answer</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-4">About this Project</h2>
                    <div className="prose prose-sm text-gray-600 leading-relaxed space-y-3">
                        <p>
                            This is an <strong>interactive learning platform</strong> for mastering <code className="bg-gray-100 px-1 rounded text-jq-blue">jq</code>,
                            the powerful command-line JSON processor. All processing happens client-side using <code className="bg-gray-100 px-1 rounded text-jq-blue">jq-web</code>,
                            so you can use it offline!
                        </p>
                        <p>
                            <strong>Features:</strong> Syntax highlighting, challenge mode with visual diffs, progress tracking,
                            50+ curated recipes, and multi-line query support.
                        </p>
                        <p className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                            Made with ❤️ using Google AI Studio and Antigravity
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};
