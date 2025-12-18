
import React from 'react';
import { ToolType } from '../types';

interface HeaderProps {
  activeTool: ToolType;
}

const Header: React.FC<HeaderProps> = ({ activeTool }) => {
  const getTitles = () => {
    switch (activeTool) {
      case 'dashboard': return { title: 'Studio Overview', subtitle: 'Manage your creative workspace' };
      case 'templates': return { title: 'Content Templates', subtitle: 'Choose a professional blueprint for your content' };
      case 'text': return { title: 'Magic Writer', subtitle: 'AI-assisted writing for scripts, blogs and social' };
      case 'image': return { title: 'Vision Pro', subtitle: 'Transform ideas into stunning visual assets' };
      case 'video': return { title: 'Motion Studio', subtitle: 'Cinematic AI video generation with Veo' };
      case 'audio': return { title: 'Vocalize', subtitle: 'Professional voiceovers and audio content' };
      default: return { title: 'NovaContent Studio', subtitle: 'Creative Intelligence' };
    }
  };

  const info = getTitles();

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-slate-800">{info.title}</h1>
        <p className="text-sm text-slate-500 hidden sm:block">{info.subtitle}</p>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <i className="fa-regular fa-bell text-xl"></i>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200"></div>
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">Alex Rivera</p>
            <p className="text-[10px] text-slate-500 font-medium">Pro Creator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 overflow-hidden">
            <img src="https://picsum.photos/seed/alex/100/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
