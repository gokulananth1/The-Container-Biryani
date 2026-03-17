
import React, { useState } from 'react';
import { HomePageContent } from '../types';

interface ContentManagerProps {
  content: HomePageContent;
  onUpdate: (newContent: HomePageContent) => void;
}

const ContentManager: React.FC<ContentManagerProps> = ({ content, onUpdate }) => {
  const [formData, setFormData] = useState<HomePageContent>(content);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED'>('IDLE');

  const handleInputChange = (section: keyof HomePageContent, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const handleFeatureChange = (index: number, field: 'title' | 'desc', value: string) => {
    const newFeatures = [...formData.about.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      about: {
        ...prev.about,
        features: newFeatures,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('SAVING');
    onUpdate(formData);
    setTimeout(() => {
      setSaveStatus('SAVED');
      setTimeout(() => setSaveStatus('IDLE'), 2000);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="brand-font text-3xl lg:text-4xl text-slate-900 uppercase">Site Editor</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Homepage Content Protocol</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saveStatus !== 'IDLE'}
          className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center justify-center transform active:scale-95 uppercase tracking-widest"
        >
          {saveStatus === 'IDLE' && 'Publish Changes'}
          {saveStatus === 'SAVING' && 'Publishing...'}
          {saveStatus === 'SAVED' && 'Published!'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Hero Section */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="brand-font text-xl text-orange-600 uppercase tracking-wider mb-6">Hero Section</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Headline</label>
              <input 
                type="text"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-orange-500 outline-none"
                value={formData.hero.title.replace(/<br\/>/g, '').replace(/<span class="[^"]*">/g, '').replace(/<\/span>/g, '').replace(/<i>/g, '').replace(/<\/i>/g, '')}
                onChange={e => handleInputChange('hero', 'title', e.target.value)}
                placeholder="Enter hero title"
              />
               <p className="text-[9px] text-slate-400 mt-2">Use HTML tags like `&lt;br/&gt;` for line breaks or `&lt;span class="text-orange-600 italic"&gt;...&lt;/span&gt;` for styling.</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sub-headline</label>
              <textarea 
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-orange-500 outline-none"
                value={formData.hero.subtitle.replace(/<br\/>/g, "\n")}
                onChange={e => handleInputChange('hero', 'subtitle', e.target.value.replace(/\n/g, '<br/>'))}
                placeholder="Enter hero subtitle"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="brand-font text-xl text-orange-600 uppercase tracking-wider mb-6">About Section</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
              <textarea 
                rows={4}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-orange-500 outline-none"
                value={formData.about.description}
                onChange={e => handleInputChange('about', 'description', e.target.value)}
                placeholder="Enter about description"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.about.features.map((feature, index) => (
                <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Feature {index + 1} Title</label>
                  <input
                    type="text"
                    className="w-full p-2 mb-2 bg-white border border-slate-200 rounded-md"
                    value={feature.title}
                    onChange={e => handleFeatureChange(index, 'title', e.target.value)}
                  />
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Feature {index + 1} Description</label>
                   <input
                    type="text"
                    className="w-full p-2 bg-white border border-slate-200 rounded-md"
                    value={feature.desc}
                    onChange={e => handleFeatureChange(index, 'desc', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Insights Section */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="brand-font text-xl text-orange-600 uppercase tracking-wider mb-6">Visitor Insights</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Service Tip</label>
                <textarea 
                  rows={4}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-orange-500 outline-none"
                  value={formData.insights.serviceTip}
                  onChange={e => handleInputChange('insights', 'serviceTip', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Atmosphere Insight</label>
                <textarea 
                  rows={4}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-orange-500 outline-none"
                  value={formData.insights.atmosphere}
                  onChange={e => handleInputChange('insights', 'atmosphere', e.target.value)}
                />
              </div>
           </div>
        </div>

      </form>
    </div>
  );
};

export default ContentManager;
