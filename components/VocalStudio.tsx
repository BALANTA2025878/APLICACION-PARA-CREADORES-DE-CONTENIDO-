
import React, { useState, useRef } from 'react';
import { generateAudioSpeech, decodeBase64Audio, decodeAudioData } from '../services/geminiService';
import { GeneratedAsset, VoiceName } from '../types';

interface VocalStudioProps {
  onAssetGenerated: (asset: GeneratedAsset) => void;
}

const VocalStudio: React.FC<VocalStudioProps> = ({ onAssetGenerated }) => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState<string>(VoiceName.KORE);
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const voices = [
    { name: VoiceName.ZEPHYR, icon: 'fa-wind', color: 'text-sky-500' },
    { name: VoiceName.PUCK, icon: 'fa-ghost', color: 'text-amber-500' },
    { name: VoiceName.CHARON, icon: 'fa-anchor', color: 'text-slate-500' },
    { name: VoiceName.KORE, icon: 'fa-seedling', color: 'text-emerald-500' },
    { name: VoiceName.FENRIR, icon: 'fa-paw', color: 'text-rose-500' },
  ];

  const handleSynthesize = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const base64Audio = await generateAudioSpeech(text, voice);
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const audioBytes = decodeBase64Audio(base64Audio);
        const buffer = await decodeAudioData(audioBytes, audioContextRef.current);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.start();

        onAssetGenerated({
          id: Math.random().toString(36).substr(2, 9),
          type: 'audio',
          title: `VO - ${text.slice(0, 20)}...`,
          content: 'Audio Stream Generated',
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error(error);
      alert('Speech generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center">
          <i className="fa-solid fa-microphone-lines text-indigo-500 mr-4"></i>
          AI Narrator
        </h2>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Choose a Voice Personality</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {voices.map(v => (
                <button
                  key={v.name}
                  onClick={() => setVoice(v.name)}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center transition-all ${
                    voice === v.name 
                    ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                    : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 text-xl ${v.color}`}>
                    <i className={`fa-solid ${v.icon}`}></i>
                  </div>
                  <span className={`text-sm font-bold ${voice === v.name ? 'text-indigo-700' : 'text-slate-500'}`}>
                    {v.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Script to Narration</label>
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste the text you want the AI to read..."
                className="w-full h-48 p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none font-medium text-slate-700"
              ></textarea>
              <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {text.length} / 5000 characters
              </div>
            </div>
          </div>

          <button
            onClick={handleSynthesize}
            disabled={loading || !text.trim()}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center uppercase tracking-widest"
          >
            {loading ? (
              <><i className="fa-solid fa-spinner fa-spin mr-3"></i> Processing Audio...</>
            ) : (
              <><i className="fa-solid fa-waveform-lines mr-3"></i> Synthesize & Play</>
            )}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white flex items-center justify-between border border-slate-800 shadow-2xl">
        <div className="flex items-center space-x-6">
          <div className="w-14 h-14 bg-indigo-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-indigo-500/50">
            <i className="fa-solid fa-play text-xl ml-1"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold">Studio Monitor</h3>
            <p className="text-slate-400 text-sm">24-bit / 48kHz High Fidelity PCM</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {[0.2, 0.4, 0.8, 0.3, 0.6, 0.9, 0.4, 0.7, 0.3].map((h, i) => (
            <div 
              key={i} 
              className="w-1 bg-indigo-400/30 rounded-full h-12 relative overflow-hidden"
            >
              <div 
                className={`absolute bottom-0 w-full bg-indigo-400 rounded-full transition-all duration-500 ${loading ? 'animate-bounce' : ''}`}
                style={{ height: `${h * 100}%` }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VocalStudio;
