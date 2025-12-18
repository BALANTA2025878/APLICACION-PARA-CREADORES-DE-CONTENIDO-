
import React from 'react';
import { ToolType, GeneratedAsset } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  assets: GeneratedAsset[];
  onNavigate: (tool: ToolType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ assets, onNavigate }) => {
  const chartData = [
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 19 },
    { name: 'Wed', count: 15 },
    { name: 'Thu', count: 22 },
    { name: 'Fri', count: 30 },
    { name: 'Sat', count: 25 },
    { name: 'Sun', count: 18 },
  ];

  const quickActions = [
    { id: 'text', title: 'Write Blog', icon: 'fa-file-lines', color: 'bg-blue-500' },
    { id: 'image', title: 'Gen Image', icon: 'fa-image', color: 'bg-purple-500' },
    { id: 'video', title: 'Create Clip', icon: 'fa-video', color: 'bg-rose-500' },
    { id: 'audio', title: 'Voiceover', icon: 'fa-volume-high', color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Quick Launch */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Studio Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.id as ToolType)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col items-center text-center"
            >
              <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-${action.color.split('-')[1]}-200`}>
                <i className={`fa-solid ${action.icon} text-xl`}></i>
              </div>
              <h3 className="font-semibold text-slate-800">{action.title}</h3>
              <p className="text-xs text-slate-500 mt-1">Ready to create</p>
            </button>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Performance Statistics */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Creation Activity</h2>
              <p className="text-sm text-slate-500">Weekly breakdown of AI assets generated</p>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              +14% Growth
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? '#4f46e5' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Storage / Usage */}
        <div className="bg-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-xl shadow-indigo-200">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div>
            <h2 className="text-lg font-bold">Creator Plan</h2>
            <p className="text-indigo-100 text-sm mt-1">Unlimited Pro features active</p>
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-4xl font-black">94%</span>
              <span className="text-xs uppercase font-bold tracking-widest opacity-80">Efficiency Score</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>
          <button className="mt-8 bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors">
            Upgrade Capacity
          </button>
        </div>
      </div>

      {/* Recent Assets */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Recent Creations</h2>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View Gallery</button>
        </div>
        {assets.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-folder-open text-slate-300 text-2xl"></i>
            </div>
            <h3 className="text-slate-500 font-medium">No assets created yet</h3>
            <p className="text-slate-400 text-sm mt-1">Start generating content using the sidebar tools</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.slice(0, 3).map(asset => (
              <div key={asset.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group shadow-sm hover:shadow-md transition-all">
                {asset.type === 'image' || asset.type === 'video' ? (
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    {asset.type === 'image' ? (
                      <img src={asset.content} alt={asset.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <video src={asset.content} className="w-full h-full object-cover" controls={false} />
                    )}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] text-white font-bold uppercase tracking-wider">
                      {asset.type}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-indigo-50/50 aspect-video flex flex-col justify-center">
                    <div className="mb-2">
                      <i className={`fa-solid ${asset.type === 'text' ? 'fa-quote-left' : 'fa-music'} text-indigo-300 text-3xl opacity-50`}></i>
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-3 italic">
                      {asset.type === 'text' ? asset.content : 'Audio asset generated successfully'}
                    </p>
                  </div>
                )}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 truncate w-40">{asset.title}</h4>
                    <p className="text-xs text-slate-400">{new Date(asset.timestamp).toLocaleDateString()}</p>
                  </div>
                  <button className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                    <i className="fa-solid fa-ellipsis"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
