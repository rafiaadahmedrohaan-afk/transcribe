
import React, { useState, useCallback } from 'react';
import Uploader from './components/Uploader';
import TranscriptDisplay from './components/TranscriptDisplay';
import LoadingState from './components/LoadingState';
import { AppState } from './types';
import { transcribeVideo } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    file: null,
    videoUrl: null,
    isLoading: false,
    result: null,
    error: null,
    progressMessage: 'Preparing video...'
  });

  const handleFileSelect = useCallback(async (file: File) => {
    const videoUrl = URL.createObjectURL(file);
    setState(prev => ({
      ...prev,
      file,
      videoUrl,
      isLoading: true,
      error: null,
      result: null,
      progressMessage: 'Processing video data...'
    }));

    try {
      setState(prev => ({ ...prev, progressMessage: 'Reading video file...' }));
      const reader = new FileReader();
      
      const fileAsBase64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setState(prev => ({ ...prev, progressMessage: 'Gemini is transcribing & translating...' }));
      const transcriptionResult = await transcribeVideo(fileAsBase64, file.type);

      setState(prev => ({
        ...prev,
        isLoading: false,
        result: transcriptionResult,
        progressMessage: ''
      }));

    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'An unexpected error occurred during transcription.'
      }));
    }
  }, []);

  const reset = () => {
    setState({
      file: null,
      videoUrl: null,
      isLoading: false,
      result: null,
      error: null,
      progressMessage: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center text-white text-xl font-bold relative overflow-hidden group shadow-inner">
              <span className="relative z-10">R</span>
              <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-400 rounded-full group-hover:scale-125 transition-transform"></div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-950">
              Rohaan<span className="text-emerald-700">Transcribe</span>
            </h1>
          </div>
          
          {/* Restricted Usage Badge */}
          <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-black text-emerald-900 uppercase tracking-widest whitespace-nowrap">
              BONOBHUMI USAGE ONLY
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input and Video Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
              <h2 className="text-lg font-semibold mb-4 text-emerald-950">Video Source</h2>
              {!state.file ? (
                <Uploader onFileSelect={handleFileSelect} disabled={state.isLoading} />
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden bg-black aspect-video border border-emerald-100">
                    {state.videoUrl && (
                      <video 
                        src={state.videoUrl} 
                        controls 
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500 truncate max-w-[200px]">
                      {state.file.name}
                    </p>
                    <button 
                      onClick={reset}
                      disabled={state.isLoading}
                      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      Remove Video
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-emerald-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <span className="mr-2">How it works</span>
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              </h3>
              <ul className="space-y-3 text-emerald-50 relative z-10">
                <li className="flex items-start space-x-3">
                  <span className="bg-emerald-800 text-amber-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5 border border-amber-400/20">1</span>
                  <span>Upload a video clip (up to 50MB).</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-emerald-800 text-amber-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5 border border-amber-400/20">2</span>
                  <span>AI analyzes the audio and context.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-emerald-800 text-amber-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5 border border-amber-400/20">3</span>
                  <span>View transcripts in English and Bangla.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Transcription Results */}
          <div className="lg:col-span-7">
            {state.isLoading ? (
              <div className="bg-white rounded-2xl border border-emerald-50 shadow-sm h-full flex items-center justify-center">
                <LoadingState message={state.progressMessage} />
              </div>
            ) : state.result ? (
              <TranscriptDisplay result={state.result} />
            ) : state.error ? (
              <div className="bg-red-50 p-8 rounded-2xl border border-red-100 text-center space-y-4">
                <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-red-900">Transcription Failed</h3>
                <p className="text-red-700">{state.error}</p>
                <button 
                  onClick={reset}
                  className="px-6 py-2 bg-emerald-900 text-white rounded-lg hover:bg-emerald-800 transition-colors shadow-md"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="bg-slate-100 rounded-2xl border border-dashed border-emerald-100 h-full flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <div className="p-4 bg-emerald-50 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#064e3b" strokeWidth="2" opacity="0.6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-emerald-900/60">No results to display</p>
                <p className="text-sm max-w-xs mt-1">Upload a video on the left to start processing.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-600 font-medium text-base tracking-wide uppercase">2026 Rohaan Transcribe</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
