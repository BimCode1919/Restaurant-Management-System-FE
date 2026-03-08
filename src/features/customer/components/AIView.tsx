import React from 'react';

interface Props {
  ai: {
    query: string;
    setQuery: (val: string) => void;
    response: string;
    setResponse: (val: string) => void;
    loading: boolean;
    askAI: (type: 'FOOD' | 'GUIDE') => void;
  };
}

const AIView: React.FC<Props> = ({ ai }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 bg-cheese rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cheese/20">
            <span className="material-symbols-outlined">smart_toy</span>
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-tighter text-dark-gray">
              Smart Assistant
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Smart Concierge Service
            </p>
          </div>
        </div>

        <textarea
          value={ai.query}
          onChange={e => ai.setQuery(e.target.value)}
          placeholder="Example: 'Which dishes are spicy?' or 'How can I reserve a table for 10 people?'"
          className="w-full rounded-3xl border-gray-100 bg-gray-50 focus:ring-2 focus:ring-cheese focus:bg-white p-5 text-sm min-h-[120px] outline-none transition-all resize-none text-dark-gray"
        />

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            disabled={ai.loading || !ai.query}
            onClick={() => ai.askAI('FOOD')}
            className="h-14 bg-burgundy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 shadow-lg shadow-burgundy/20 active:scale-95 transition-all"
          >
            Food Suggestions
          </button>

          <button
            disabled={ai.loading || !ai.query}
            onClick={() => ai.askAI('GUIDE')}
            className="h-14 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 shadow-lg shadow-gray-900/20 active:scale-95 transition-all"
          >
            Ask About Services
          </button>
        </div>
      </div>

      {/* Response Section */}
      {ai.loading && (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <div className="size-10 rounded-full border-4 border-cheese border-t-transparent animate-spin"></div>
          <p className="text-cheese font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">
            Connecting to the kitchen...
          </p>
        </div>
      )}

      {ai.response && !ai.loading && (
        <div className="bg-white p-8 rounded-[2.5rem] border-l-[6px] border-cheese shadow-lg animate-in zoom-in duration-300 relative">
          <button
            onClick={() => ai.setResponse('')}
            className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-300 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cheese">
              AI Response
            </span>
          </div>

          <div className="prose prose-sm text-gray-600 leading-relaxed font-medium">
            {ai.response}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIView;