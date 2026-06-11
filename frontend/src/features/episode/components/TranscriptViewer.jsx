import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

export default function TranscriptViewer({ transcript }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!transcript) return null;

  return (
    <div className="bg-[#0f0f11] border border-white/5 rounded-2xl overflow-hidden mt-12">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-3 text-slate-100 font-semibold text-lg">
          <FileText className="w-5 h-5 text-emerald-500" />
          Full Episode Transcript
        </div>
        <div className="text-slate-400">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-6 md:p-8 max-h-[600px] overflow-y-auto custom-scrollbar">
          <p className="text-slate-300 leading-loose text-lg font-serif">
            {transcript}
          </p>
        </div>
      )}
    </div>
  );
}