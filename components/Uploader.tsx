
import React, { useRef } from 'react';

interface UploaderProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const Uploader: React.FC<UploaderProps> = ({ onFileSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("File too large. Please select a video under 50MB for processing.");
        return;
      }
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-2xl p-12 transition-all text-center flex flex-col items-center justify-center 
        ${disabled ? 'border-slate-200 bg-slate-50 cursor-not-allowed' : 'border-emerald-200 bg-white hover:border-emerald-600 hover:bg-emerald-50 cursor-pointer shadow-sm'}`}
      onClick={!disabled ? handleClick : undefined}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
        disabled={disabled}
      />
      <div className={`p-4 rounded-full mb-4 ${disabled ? 'bg-slate-100 text-slate-400' : 'bg-emerald-100 text-emerald-700'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">Upload your video</h3>
      <p className="text-slate-500 max-w-xs mx-auto">
        Select a video (max 50MB) to transcribe into English and Bangla automatically.
      </p>
      {!disabled && (
        <button className="mt-6 px-6 py-2.5 bg-emerald-900 text-white font-medium rounded-lg hover:bg-emerald-800 transition-colors shadow-md">
          Browse Files
        </button>
      )}
    </div>
  );
};

export default Uploader;
