
import React, { useState } from 'react';
import { generateTextContent } from '../services/geminiService';
import { GeneratedAsset } from '../types';

interface TextStudioProps {
  onAssetGenerated: (asset: GeneratedAsset) => void;
}

const TextStudio: React.FC<TextStudioProps> = ({ onAssetGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<'blog' | 'social' | 'script'>('blog');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const text = await generateTextContent(prompt, type);
      setResult(text || '');
      onAssetGenerated({
        id: Math.random().toString(36).substr(2, 9),
        type: 'text',
        title: prompt.slice(0, 30) + '...',
        content: text || '',
        timestamp: Date.now(),
        tags: [type]
      });
    } catch (error) {
      console.error(error);
      alert('Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-fadeIn h-full">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <i className="fa-solid fa-wand-magic-sparkles text-indigo-500 mr-3"></i>
          Magic Draft
        </h2>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">What are you creating?</label>
            <div className="grid grid-cols-3 gap-3">
              {(['blog', 'social', 'script'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                    type === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description / Topics</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Write a blog about the future of remote work in 2025..."
              className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            ></textarea>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center"
        >
          {loading ? (
            <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Generating...</>
          ) : (
            <><i className="fa-solid fa-paper-plane mr-2"></i> Create Content</>
          )}
        </button>
      </div>

      <div className="bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Preview</span>
          {result && (
            <button 
              onClick={() => navigator.clipboard.writeText(result)}
              className="text-indigo-600 hover:text-indigo-700 text-xs font-bold transition-colors"
            >
              COPY TO CLIPBOARD
            </button>
          )}
        </div>
        <div className="flex-1 p-8 overflow-y-auto bg-white custom-scrollbar prose prose-slate">
          {result ? (
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-serif">
              {result}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <i className="fa-solid fa-scroll text-5xl mb-4 text-slate-300"></i>
              <p className="text-slate-400">Your generated masterpiece will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextStudio;
