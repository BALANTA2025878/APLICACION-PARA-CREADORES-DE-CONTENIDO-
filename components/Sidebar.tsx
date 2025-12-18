
import React from 'react';
import { ToolType } from '../types';

interface SidebarProps {
  activeTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onToolSelect }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-house' },
    { id: 'templates', label: 'Templates', icon: 'fa-layer-group' },
    { id: 'text', label: 'Magic Writer', icon: 'fa-pen-nib' },
    { id: 'image', label: 'Vision Pro', icon: 'fa-palette' },
    { id: 'video', label: 'Motion Studio', icon: 'fa-clapperboard' },
    { id: 'audio', label: 'Vocalize', icon: 'fa-microphone' },
  ];

  return (
    <aside className="w-20 md:w-64 bg-slate-900 text-slate-400 flex flex-col border-r border-slate-800 transition-all">
      <div className="p-6 flex items-center justify-center md:justify-start space-x-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
          <i className="fa-solid fa-bolt"></i>
        </div>
        <span className="hidden md:block font-bold text-white text-xl tracking-tight">NovaContent</span>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onToolSelect(item.id as ToolType)}
            className={`w-full flex items-center p-3 rounded-xl transition-all group ${
              activeTool === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-6 text-center text-lg`}></i>
            <span className="hidden md:block ml-4 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="hidden md:block p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Storage</p>
          <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-[10px] text-slate-500 text-right">4.5GB of 10GB</p>
        </div>
        <button className="w-full mt-4 flex items-center justify-center md:justify-start text-slate-500 hover:text-white transition-colors group">
          <i className="fa-solid fa-gear group-hover:rotate-45 transition-transform"></i>
          <span className="hidden md:block ml-4 text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
