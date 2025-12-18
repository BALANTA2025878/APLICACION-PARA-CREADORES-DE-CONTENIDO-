
import React, { useState, useEffect } from 'react';
import { ToolType, GeneratedAsset } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TextStudio from './components/TextStudio';
import ImageStudio from './components/ImageStudio';
import MotionStudio from './components/MotionStudio';
import VocalStudio from './components/VocalStudio';
import TemplateLibrary from './components/TemplateLibrary';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('dashboard');
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [isVeoKeySelected, setIsVeoKeySelected] = useState(false);

  useEffect(() => {
    // Check key selection for Veo-powered tools
    const checkApiKey = async () => {
      if (typeof window.aistudio !== 'undefined') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsVeoKeySelected(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectApiKey = async () => {
    if (typeof window.aistudio !== 'undefined') {
      await window.aistudio.openSelectKey();
      setIsVeoKeySelected(true); // Assume success per guidelines
    }
  };

  const addAsset = (asset: GeneratedAsset) => {
    setAssets(prev => [asset, ...prev]);
  };

  const renderStudio = () => {
    switch (activeTool) {
      case 'dashboard':
        return <Dashboard assets={assets} onNavigate={setActiveTool} />;
      case 'text':
        return <TextStudio onAssetGenerated={addAsset} />;
      case 'templates':
        return <TemplateLibrary onAssetGenerated={addAsset} />;
      case 'image':
        return <ImageStudio onAssetGenerated={addAsset} />;
      case 'video':
        return (
          <MotionStudio 
            onAssetGenerated={addAsset} 
            isKeySelected={isVeoKeySelected} 
            onSelectKey={handleSelectApiKey} 
          />
        );
      case 'audio':
        return <VocalStudio onAssetGenerated={addAsset} />;
      default:
        return <Dashboard assets={assets} onNavigate={setActiveTool} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      <Sidebar activeTool={activeTool} onToolSelect={setActiveTool} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header activeTool={activeTool} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {renderStudio()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
