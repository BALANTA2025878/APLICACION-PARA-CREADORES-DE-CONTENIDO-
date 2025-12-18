
import React, { useState } from 'react';
import { ContentTemplate, GeneratedAsset } from '../types';
import { generateTextContent } from '../services/geminiService';

const TEMPLATES: ContentTemplate[] = [
  {
    id: 'blog-post',
    name: 'SEO Blog Post',
    description: 'Structured long-form content optimized for search engines.',
    icon: 'fa-newspaper',
    color: 'bg-indigo-500',
    fields: [
      { label: 'Title / Subject', key: 'title', type: 'text', placeholder: 'The future of AI in marketing' },
      { label: 'Key Points', key: 'points', type: 'textarea', placeholder: 'Benefits, challenges, case studies...' },
      { label: 'Tone of Voice', key: 'tone', type: 'select', options: ['Professional', 'Informative', 'Casual', 'Provocative'] },
      { label: 'Target Audience', key: 'audience', type: 'text', placeholder: 'Tech executives, small business owners...' }
    ]
  },
  {
    id: 'instagram-caption',
    name: 'Instagram Caption',
    description: 'Catchy captions with hashtags and emojis to drive engagement.',
    icon: 'fa-camera',
    color: 'bg-rose-500',
    fields: [
      { label: 'What is in the photo?', key: 'description', type: 'textarea', placeholder: 'A new product launch event at the office' },
      { label: 'Vibe', key: 'vibe', type: 'select', options: ['Hype', 'Minimalist', 'Inspirational', 'Funny', 'Educational'] },
      { label: 'Call to Action', key: 'cta', type: 'text', placeholder: 'Check the link in bio' }
    ]
  },
  {
    id: 'twitter-thread',
    name: 'Twitter Thread',
    description: 'Engaging multi-part tweets designed for viral reach.',
    icon: 'fa-hashtag',
    color: 'bg-blue-500',
    fields: [
      { label: 'Core Topic', key: 'topic', type: 'text', placeholder: '10 lessons from my first startup' },
      { label: 'Main Value Add', key: 'value', type: 'textarea', placeholder: 'Explain how to avoid common pitfalls' },
      { label: 'Approximate length', key: 'length', type: 'select', options: ['Short (3-5 tweets)', 'Medium (6-10 tweets)', 'Epic (11+ tweets)'] }
    ]
  },
  {
    id: 'youtube-script',
    name: 'YouTube Script',
    description: 'Hook, body, and outro for high-retention video content.',
    icon: 'fa-play',
    color: 'bg-red-500',
    fields: [
      { label: 'Video Title', key: 'title', type: 'text', placeholder: 'Why everyone is wrong about Web3' },
      { label: 'The Hook', key: 'hook', type: 'textarea', placeholder: 'Start with a controversial statement' },
      { label: 'Key Segments', key: 'segments', type: 'textarea', placeholder: 'Intro, History, My Take, Future, Summary' }
    ]
  }
];

interface TemplateLibraryProps {
  onAssetGenerated: (asset: GeneratedAsset) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onAssetGenerated }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    setLoading(true);

    const prompt = `Refine and generate content for a ${selectedTemplate.name}. 
    Details: ${Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join(', ')}.
    Please provide a polished, high-quality version of this content.`;

    try {
      const typeMapping: any = {
        'blog-post': 'blog',
        'instagram-caption': 'social',
        'twitter-thread': 'social',
        'youtube-script': 'script'
      };
      
      const content = await generateTextContent(prompt, typeMapping[selectedTemplate.id] || 'blog');
      setResult(content || '');
      
      onAssetGenerated({
        id: Math.random().toString(36).substr(2, 9),
        type: 'text',
        title: `${selectedTemplate.name}: ${formData.title || formData.topic || formData.description?.slice(0, 15)}`,
        content: content || '',
        timestamp: Date.now(),
        tags: [selectedTemplate.id]
      });
    } catch (error) {
      console.error(error);
      alert('Failed to generate template content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full animate-fadeIn">
      {!selectedTemplate ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template);
                setFormData({});
                setResult('');
              }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
            >
              <div className={`${template.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg`}>
                <i className={`fa-solid ${template.icon}`}></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{template.name}</h3>
              <p className="text-slate-500">{template.description}</p>
              <div className="mt-8 flex items-center text-indigo-600 font-bold text-sm">
                USE TEMPLATE <i className="fa-solid fa-chevron-right ml-2 group-hover:ml-4 transition-all"></i>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8 h-full">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="text-slate-400 hover:text-slate-800 transition-colors"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i> Back to Library
              </button>
              <div className="flex items-center space-x-3">
                <div className={`${selectedTemplate.color} w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs`}>
                  <i className={`fa-solid ${selectedTemplate.icon}`}></i>
                </div>
                <span className="font-bold text-slate-800">{selectedTemplate.name}</span>
              </div>
            </div>

            <div className="flex-1 p-8 space-y-6 overflow-y-auto">
              {selectedTemplate.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    {field.label}
                  </label>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      placeholder={field.placeholder}
                      rows={4}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    ></textarea>
                  )}
                  {field.type === 'select' && (
                    <select
                      value={formData[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    >
                      <option value="">Select an option...</option>
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-300 transition-all flex items-center justify-center uppercase tracking-widest"
              >
                {loading ? (
                  <><i className="fa-solid fa-spinner fa-spin mr-3"></i> Refining with AI...</>
                ) : (
                  <><i className="fa-solid fa-wand-sparkles mr-3"></i> Generate Content</>
                )}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
             <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Output</span>
                {result && (
                  <button 
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-colors"
                  >
                    <i className="fa-solid fa-copy mr-1"></i> COPY
                  </button>
                )}
             </div>
             <div className="flex-1 p-8 overflow-y-auto bg-white">
                {result ? (
                  <div className="prose prose-indigo max-w-none whitespace-pre-wrap font-serif text-slate-800 leading-relaxed">
                    {result}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <i className="fa-solid fa-magic-wand-sparkles text-slate-300 text-xl"></i>
                    </div>
                    <p className="text-slate-400 text-sm max-w-xs">Complete the form on the left to generate your custom content.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;
