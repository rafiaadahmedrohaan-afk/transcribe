
import React from 'react';
import { TranscriptionResult } from '../types';

interface TranscriptDisplayProps {
  result: TranscriptionResult;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-emerald-950">Transcription Result</h2>
        <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-sm font-semibold border border-emerald-200">
          <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
          Detected: {result.originalLanguageDetected}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* English Column */}
        <div className="bg-white rounded-xl shadow-md border border-emerald-50 overflow-hidden flex flex-col group transition-all hover:shadow-lg">
          <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
            <span className="font-bold text-emerald-900 uppercase tracking-widest text-xs">English Transcript</span>
            <button 
              onClick={() => navigator.clipboard.writeText(result.english)}
              className="text-emerald-400 hover:text-amber-500 transition-colors p-1"
              title="Copy English"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
          <div className="p-5 text-slate-700 leading-relaxed whitespace-pre-wrap flex-grow min-h-[150px]">
            {result.english || <span className="text-slate-400 italic">No audio detected to transcribe.</span>}
          </div>
        </div>

        {/* Bangla Column */}
        <div className="bg-white rounded-xl shadow-md border border-emerald-50 overflow-hidden flex flex-col group transition-all hover:shadow-lg">
          <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
            <span className="font-bold text-emerald-900 uppercase tracking-widest text-xs">বাংলা ট্রান্সক্রিপ্ট</span>
            <button 
              onClick={() => navigator.clipboard.writeText(result.bangla)}
              className="text-emerald-400 hover:text-amber-500 transition-colors p-1"
              title="Copy Bangla"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
          <div className="p-5 text-emerald-950 leading-relaxed font-bengali text-lg whitespace-pre-wrap flex-grow min-h-[150px]">
            {result.bangla || <span className="text-slate-400 italic">কোন অডিও পাওয়া যায়নি।</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptDisplay;
