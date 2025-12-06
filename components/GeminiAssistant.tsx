import React, { useState } from 'react';
import { Sparkles, Send, X, MessageCircle } from 'lucide-react';
import { getGeminiRecommendation } from '../services/geminiService';
import { Category } from '../types';

interface GeminiAssistantProps {
  menuData: Category[];
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ menuData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse('');
    
    try {
      const result = await getGeminiRecommendation(input, menuData);
      setResponse(result || "Could not get a recommendation.");
    } catch (e) {
      setResponse("Sorry, something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-40 flex items-center gap-2 animate-bounce"
      >
        <Sparkles size={20} />
        <span className="text-sm font-semibold">Ask AI Chef</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-indigo-100 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <Sparkles size={18} />
          <h3 className="font-bold text-sm">Dezzerto AI Guide</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1">
          <X size={18} />
        </button>
      </div>
      
      <div className="p-4 flex-1 bg-slate-50 min-h-[150px] max-h-[300px] overflow-y-auto text-sm">
        {!response && !loading && (
          <p className="text-gray-500 italic">"What are you in the mood for? Something chocolatey? Fruity? Or maybe something hot?"</p>
        )}
        {loading && (
          <div className="flex items-center gap-2 text-indigo-600">
            <span className="animate-spin">✨</span> Thinking...
          </div>
        )}
        {response && (
          <div className="prose prose-sm text-gray-800">
            {response}
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="E.g., I love dark chocolate..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <button
          onClick={handleAsk}
          disabled={loading || !input.trim()}
          className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};