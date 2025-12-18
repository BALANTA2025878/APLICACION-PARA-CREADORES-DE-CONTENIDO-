
import React, { useState, useEffect } from 'react';
import { startVideoGeneration, checkVideoOperation } from '../services/geminiService';
import { GeneratedAsset } from '../types';

interface MotionStudioProps {
  onAssetGenerated: (asset: GeneratedAsset) => void;
  isKeySelected: boolean;
  onSelectKey: () => void;
}

const MotionStudio: React.FC<MotionStudioProps> = ({ onAssetGenerated, isKeySelected, onSelectKey }) => {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState<'16:9' | '9:16'>('16:9');
  const [status, setStatus] = useState<{ loading: boolean; progress: string; result?: string }>({ 
    loading: false, 
    progress: '' 
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setStatus({ loading: true, progress: 'Initiating video engine...' });
    
    try {
      let op = await startVideoGeneration(prompt, ratio);
      
      const poll = async () => {
        const currentOp = await checkVideoOperation(op);
        if (currentOp.done) {
          const downloadLink = currentOp.response?.generatedVideos?.[0]?.video?.uri;
          const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
          const videoBlob = await videoRes.blob();
          const videoUrl = URL.createObjectURL(videoBlob);
          
          setStatus({ loading: false, progress: '', result: videoUrl });
          onAssetGenerated({
            id: Math.random().toString(36).substr(2, 9),
            type: 'video',
            title: prompt.slice(0, 30),
            content: videoUrl,
            timestamp: Date.now()
          });
        } else {
          const updates = [
            'Simulating physics...',
            'Rendering frames...',
            'Encoding motion...',
            'Optimizing bitstream...',
            'Almost there...'
          ];
          const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
          setStatus(prev => ({ ...prev, progress: randomUpdate }));
          setTimeout(poll, 10000);
        }
      };

      poll();
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes('Requested entity was not found')) {
        alert('API Key error. Please re-select your key.');
        onSelectKey();
      } else {
        alert('Video generation failed.');
      }
      setStatus({ loading: false, progress: '' });
    }
  };

  if (!isKeySelected) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-3xl animate-fadeIn">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-500">
          <i className="fa-solid fa-key text-3xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">GCP Billing Required</h2>
        <p className="text-slate-500 text-center max-w-md mb-8">
          Motion Studio uses Veo 3.1, which requires a paid Google Cloud project. 
          Please select an API key from a project with active billing to continue.
        </p>
        <button
          onClick={onSelectKey}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          Select Billing Key
        </button>
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noreferrer"
          className="mt-6 text-sm font-medium text-slate-400 hover:text-indigo-600 transition-colors underline decoration-dotted"
        >
          Learn more about billing
        </a>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-fadeIn h-full">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <i className="fa-solid fa-film text-indigo-500 mr-3"></i>
          Cinema Studio
        </h2>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Video Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe a cinematic scene (e.g., A panoramic drone shot of a misty mountain range at sunrise...)"
              className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Aspect Ratio</label>
            <div className="flex space-x-4">
              {[
                { label: 'Landscape (16:9)', val: '16:9' },
                { label: 'Portrait (9:16)', val: '9:16' }
              ].map(r => (
                <button
                  key={r.val}
                  onClick={() => setRatio(r.val as any)}
                  className={`flex-1 py-4 rounded-xl border-2 transition-all ${
                    ratio === r.val ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <i className={`fa-solid ${r.val === '16:9' ? 'fa-tv' : 'fa-mobile-screen'} mb-1`}></i>
                  <span className="block text-xs">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={status.loading || !prompt.trim()}
          className="mt-8 w-full py-4 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center"
        >
          {status.loading ? (
            <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Generating...</>
          ) : (
            <><i className="fa-solid fa-clapperboard mr-2"></i> Render Video</>
          )}
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl relative">
        {status.loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-xl">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-indigo-500/10 rounded-full flex items-center justify-center">
                 <i className="fa-solid fa-film text-indigo-500 animate-pulse"></i>
              </div>
            </div>
            <p className="text-white text-xl font-bold mb-2">Creating Magic</p>
            <p className="text-slate-400 text-sm animate-pulse tracking-wide">{status.progress}</p>
            <p className="mt-8 text-xs text-slate-500 italic px-8 text-center">Video generation typically takes 1-2 minutes. Your patience will be rewarded with high quality cinematic frames.</p>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center p-4">
          {status.result ? (
            <video 
              src={status.result} 
              controls 
              autoPlay 
              loop 
              className="max-w-full max-h-full rounded-xl shadow-2xl bg-black"
            />
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <i className="fa-solid fa-play text-slate-700 text-3xl ml-1"></i>
              </div>
              <h3 className="text-slate-500 font-bold text-lg">Empty Viewport</h3>
              <p className="text-slate-600 text-sm mt-2 max-w-xs">Enter your scene description to begin the cinematic rendering process.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MotionStudio;
