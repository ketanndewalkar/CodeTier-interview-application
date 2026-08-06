import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle, RefreshCw } from 'lucide-react';

export default function ResumeUploader({ file, onFileSelect, onFileRemove, error }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileValidation = (selectedFile) => {
    if (!selectedFile) return;
    
    // Check if PDF
    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      onFileSelect(null, 'Please upload a valid PDF file (.pdf)');
      return;
    }

    onFileSelect(selectedFile, null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileValidation(droppedFile);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileValidation(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
        <span className="flex items-center gap-1">
          Resume Upload <span className="text-[#c084fc] font-medium">*</span>
        </span>
        <span className="text-[11px] text-zinc-500">PDF format only</span>
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleInputChange}
        className="hidden"
      />

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors group ${
            isDragging
              ? 'border-[#7C3AED] bg-[#7C3AED]/10'
              : error
              ? 'border-rose-500/60 bg-rose-500/5'
              : 'border-white/15 bg-[#09080d] hover:border-[#7C3AED]/60 hover:bg-[#120e1c]'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-purple-300 transition-colors">
              <UploadCloud className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-medium text-white">
                <span className="text-[#c084fc] hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Supported format: PDF (Max 10MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#09080d] border border-white/10 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-purple-300 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-white truncate">
                {file.name}
              </p>
              <p className="text-[11px] text-zinc-500">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Change</span>
            </button>

            <button
              type="button"
              onClick={onFileRemove}
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
