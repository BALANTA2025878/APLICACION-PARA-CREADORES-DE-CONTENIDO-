
import React, { useState } from 'react';
import { generateImageContent } from '../services/geminiService';
import { GeneratedAsset } from '../types';

interface ImageStudioProps {
  onAssetGenerated: (asset: GeneratedAsset) => void;
}

const ImageStudio: React.FC<ImageStudioProps> = ({ onAssetGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const imageUrl = await generateImageContent(prompt, ratio);
      setPreview(imageUrl);
      onAssetGenerated({
        id: Math.random().toString(36).substr(2, 9),
        type: 'image',
        title: prompt.slice(0, 30),
        content: imageUrl,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error(error);
      alert('Image generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-fadeIn h-full">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <i className="fa-solid fa-camera-retro text-indigo-500 mr-3"></i>
          Vision Lab
        </h2>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., A futuristic cyberpunk cityscape at sunset with flying cars..."
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Aspect Ratio</label>
            <div className="flex space-x-4">
              {[
                { label: 'Square (1:1)', val: '1:1' },
                { label: 'Cinema (16:9)', val: '16:9' },
                { label: 'Social (9:16)', val: '9:16' }
              ].map(r => (
                <button
                  key={r.val}
                  onClick={() => setRatio(r.val as any)}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    ratio === r.val ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <div className={`mx-auto mb-1 border-2 border-current rounded-sm ${r.val === '1:1' ? 'w-4 h-4' : r.val === '16:9' ? 'w-6 h-3' : 'w-3 h-6'}`}></div>
                  <span className="text-xs">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-all flex items-center justify-center"
        >
          {loading ? (
            <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Capturing...</>
          ) : (
            <><i className="fa-solid fa-sparkles mr-2"></i> Generate Image</>
          )}
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-bold animate-pulse">Developing Visual...</p>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center p-4">
          {preview ? (
            <img src={preview} alt="Generated result" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-image text-slate-700 text-4xl"></i>
              </div>
              <h3 className="text-slate-500 font-bold">Awaiting Input</h3>
              <p className="text-slate-600 text-sm mt-2 max-w-xs">Describe your scene and witness the power of Generative AI.</p>
            </div>
          )}
        </div>
        
        {preview && (
          <div className="p-6 bg-slate-800/80 backdrop-blur-md flex justify-center space-x-4">
            <button className="px-6 py-2 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600 transition-colors flex items-center">
              <i className="fa-solid fa-download mr-2"></i> Download
            </button>
            <button className="px-6 py-2 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600 transition-colors flex items-center">
              <i className="fa-solid fa-share-nodes mr-2"></i> Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageStudio;
