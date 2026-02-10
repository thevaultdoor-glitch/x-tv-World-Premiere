'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CloudUploadIcon, SpinnerIcon, CheckCircleIcon } from './Icons';

// The navigateTo prop is kept for compatibility but will be removed.
interface UploadPageProps {
  navigateTo: (page: string) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ navigateTo }) => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  type UploadStatus = 'idle' | 'uploading' | 'processing' | 'complete';
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [category, setCategory] = useState('Technology');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: number | undefined;
    if (status === 'uploading') {
      setUploadProgress(0);
      interval = window.setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('processing');
            return 100;
          }
          const diff = 5 + Math.random() * 5;
          return Math.min(prev + diff, 100);
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    let processingTimeout: number | undefined;
    if (status === 'processing') {
      processingTimeout = window.setTimeout(() => {
        setStatus('complete');
      }, 3000);
    }
    return () => clearTimeout(processingTimeout);
  }, [status]);
  
  useEffect(() => {
    let completionTimeout: number | undefined;
    if (status === 'complete') {
        completionTimeout = window.setTimeout(() => {
            router.push('/');
        }, 1500);
    }
    return () => clearTimeout(completionTimeout);
  }, [status, router]);


  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith('video/')) {
       if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setFile(selectedFile);
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      alert('Please select a valid video file.');
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handlePublish = () => {
    if (!file || !title) {
        alert("Please select a file and provide a title.");
        return;
    }
    setStatus('uploading');
  };

  const UploadPlaceholder = () => (
     <div 
        className={`w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg transition-colors ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-600 hover:border-zinc-500'}`}
        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
    >
      <CloudUploadIcon className="w-24 h-24 text-zinc-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Drag and drop video files to upload</h2>
      <p className="text-zinc-400 mb-6">Your videos will be private until you publish them.</p>
      <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])} accept="video/*" className="hidden"/>
      <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">
        Select Files
      </button>
    </div>
  );

  const UploadDetailsForm = () => {
    const isButtonDisabled = status !== 'idle';
    let statusText = '', buttonText = 'Publish', progressBarClass = '';
    let progressWidth = status === 'uploading' ? uploadProgress : 100;

    switch (status) {
        case 'uploading': statusText = `Uploading... ${Math.round(uploadProgress)}%`; buttonText = 'Uploading...'; progressBarClass = 'bg-blue-600'; break;
        case 'processing': statusText = 'Processing...'; buttonText = 'Processing...'; progressBarClass = 'bg-yellow-500'; break;
        case 'complete': statusText = 'Upload Complete!'; buttonText = 'Published!'; progressBarClass = 'bg-green-500'; break;
    }

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
                <h2 className="text-2xl font-bold mb-4">Details</h2>
                <div className="bg-zinc-800 rounded-lg p-6 space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">Title (required)</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isButtonDisabled} className="w-full bg-zinc-700 border border-zinc-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} disabled={isButtonDisabled} className="w-full bg-zinc-700 border border-zinc-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"></textarea>
                    </div>
                    <div>
                        <label htmlFor="visibility" className="block text-sm font-medium text-zinc-300 mb-1">Visibility</label>
                        <select id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)} disabled={isButtonDisabled} className="w-full bg-zinc-700 border border-zinc-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                            <option>Public</option> <option>Unlisted</option> <option>Private</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-1">Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} disabled={isButtonDisabled} className="w-full bg-zinc-700 border border-zinc-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                            <option>Technology</option> <option>Gaming</option> <option>Music</option> <option>Education</option> <option>Entertainment</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="lg:w-1/3">
                <div className="bg-zinc-800 rounded-lg overflow-hidden sticky top-24">
                    <div className="aspect-video bg-black flex items-center justify-center">
                       {previewUrl ? <video src={previewUrl} controls className="w-full h-full object-contain"></video> : <p className="text-zinc-400">Video Preview</p>}
                    </div>
                    <div className="p-4 text-sm space-y-2">
                        <p className="text-zinc-400">Filename: <span className="text-white font-mono break-all">{file?.name}</span></p>
                        {status !== 'idle' && (
                            <div>
                                <p className="text-zinc-300 mb-1 flex items-center gap-2 font-medium">
                                    {status === 'processing' && <SpinnerIcon className="w-4 h-4 animate-spin text-yellow-400" />}
                                    {status === 'complete' && <CheckCircleIcon className="w-4 h-4 text-green-400" />}
                                    <span>{statusText}</span>
                                </p>
                                <div className="w-full bg-zinc-600 rounded-full h-2.5 overflow-hidden">
                                    <div className={`h-2.5 rounded-full transition-all duration-300 ease-linear ${progressBarClass}`} style={{ width: `${progressWidth}%` }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <button onClick={handlePublish} disabled={isButtonDisabled} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    {buttonText}
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex-grow flex flex-col">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">{!file ? 'Upload Video' : 'Complete Your Video Details'}</h1>
        {!file ? <UploadPlaceholder /> : <UploadDetailsForm />}
      </div>
    </div>
  );
};

export default UploadPage;
