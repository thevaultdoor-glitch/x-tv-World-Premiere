
import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon, ImageIcon, VideoSparkIcon, AudioIcon, BackIcon, VoiceChatIcon, CloudUploadIcon } from './Icons';
import { 
    generateImageNanoPro, generateVideoVeo, checkVideoOperation, analyzeContent, analyzeImage,
    transcribeAudio, generateSpeech, connectToLiveSession, decodeAudioData, createPcmBlob 
} from '../services/geminiService';
import type { LiveServerMessage, LiveSession, Operation, GenerateVideosResponse, Blob as GenAIBlob } from '@google/genai';

type AITool = 'image-gen' | 'video-gen' | 'analyzer' | 'audio';

const fileToBase64 = (file: File): Promise<{ data: string, mimeType: string }> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve({ data: result.split(',')[1], mimeType: file.type });
      };
      reader.onerror = (error) => reject(error);
});

// --- Main Studio Page ---
const AIStudioPage: React.FC = () => {
    const [activeTool, setActiveTool] = useState<AITool | null>(null);

    const tools = [
        { id: 'image-gen', title: 'Image Generation', description: 'Create stunning visuals from text prompts with Nano Banana Pro.', icon: <ImageIcon className="w-10 h-10" /> },
        { id: 'video-gen', title: 'Video Generation', description: 'Bring your ideas to life. Generate videos from text or images using Veo.', icon: <VideoSparkIcon className="w-10 h-10" /> },
        { id: 'analyzer', title: 'Content Analyzer', description: 'Analyze text and images, get grounded answers from Search & Maps.', icon: <SparklesIcon className="w-10 h-10" /> },
        { id: 'audio', title: 'Audio Suite', description: 'Engage in voice chats, transcribe audio, and generate speech.', icon: <AudioIcon className="w-10 h-10" /> },
    ];

    const renderTool = () => {
        switch (activeTool) {
            case 'image-gen': return <ImageGeneratorToolGated onBack={() => setActiveTool(null)} />;
            case 'video-gen': return <VideoGeneratorToolGated onBack={() => setActiveTool(null)} />;
            case 'analyzer': return <ContentAnalyzerTool onBack={() => setActiveTool(null)} />;
            case 'audio': return <AudioSuiteTool onBack={() => setActiveTool(null)} />;
            default:
                return (
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-2">AI Studio</h1>
                        <p className="text-zinc-400 mb-12">Your central hub for content creation and analysis, powered by Gemini.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {tools.map(tool => (
                                <button key={tool.id} onClick={() => setActiveTool(tool.id as AITool)} className="bg-zinc-800 p-6 rounded-lg text-left hover:bg-zinc-700/80 transition-all transform hover:scale-105">
                                    <div className="text-blue-500 mb-3">{tool.icon}</div>
                                    <h2 className="text-xl font-semibold mb-1">{tool.title}</h2>
                                    <p className="text-zinc-400 text-sm">{tool.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return <div className="p-4 sm:p-6 lg:p-8">{renderTool()}</div>;
};

// --- API Key Gate HOC ---
const withApiKeyGate = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const ApiKeyGate: React.FC<P> = (props) => {
        const [hasKey, setHasKey] = useState(false);
        const [error, setError] = useState('');

        useEffect(() => {
            const checkKey = async () => {
                if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
                    setHasKey(true);
                }
            };
            checkKey();
        }, []);

        const handleSelectKey = async () => {
            try {
                await window.aistudio.openSelectKey();
                // Assume success to avoid race condition
                setHasKey(true);
                setError('');
            } catch (e) {
                console.error(e);
                setError('Failed to select key.');
            }
        };
        
        const handleApiError = (e: any) => {
            if (e.message.includes("Requested entity was not found")) {
                setError('Your API key is invalid or lacks permissions. Please select a valid key from a paid GCP project.');
                setHasKey(false);
            } else {
                 setError('An unexpected error occurred. Check the console for details.');
            }
        };
        
        if (!hasKey) {
            return (
                <div className="text-center max-w-lg mx-auto p-8 bg-zinc-800 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">API Key Required</h2>
                    <p className="text-zinc-400 mb-6">This feature requires a user-selected API key from a paid Google Cloud project. Please select a key to continue.</p>
                     <p className="text-zinc-400 mb-6 text-sm">For more info, visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Gemini API billing documentation</a>.</p>
                    {error && <p className="text-red-400 mb-4">{error}</p>}
                    <button onClick={handleSelectKey} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
                        Select API Key
                    </button>
                </div>
            );
        }

        return <WrappedComponent {...props} onApiError={handleApiError} />;
    };
    return ApiKeyGate;
};


// --- Tool Components ---
interface ToolProps { onBack: () => void; onApiError?: (e: any) => void; }

const ImageGeneratorTool: React.FC<ToolProps> = ({ onBack, onApiError }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [imageSize, setImageSize] = useState('1K');
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setImageUrl('');
        try {
            const base64 = await generateImageNanoPro(prompt, aspectRatio, imageSize);
            setImageUrl(`data:image/png;base64,${base64}`);
        } catch (e) {
            console.error(e);
            onApiError?.(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 mb-4 text-zinc-400 hover:text-white"><BackIcon className="w-5 h-5"/> Back to Studio</button>
            <h1 className="text-3xl font-bold mb-2">Image Generation</h1>
            <p className="text-zinc-400 mb-6">Create images with Nano Banana Pro.</p>
            <div className="space-y-4 max-w-xl">
                 <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="A photo of a Corgi wearing a party hat..." rows={3} className="w-full bg-zinc-700 p-2 rounded-md" />
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm mb-1">Aspect Ratio</label>
                        <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full bg-zinc-700 p-2 rounded-md">
                            {['1:1', '3:4', '4:3', '9:16', '16:9'].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm mb-1">Image Size</label>
                        <select value={imageSize} onChange={e => setImageSize(e.target.value)} className="w-full bg-zinc-700 p-2 rounded-md">
                            {['1K', '2K', '4K'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                 </div>
                 <button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-zinc-600">{isLoading ? 'Generating...' : 'Generate'}</button>
            </div>
            {imageUrl && <div className="mt-6"><img src={imageUrl} alt="Generated image" className="rounded-lg max-w-md" /></div>}
        </div>
    );
};

const VideoGeneratorTool: React.FC<ToolProps> = ({ onBack, onApiError }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [image, setImage] = useState<{ data: string, mimeType: string } | null>(null);
    const [status, setStatus] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const { data, mimeType } = await fileToBase64(file);
            setImage({ data, mimeType });
        }
    };

    const handleSubmit = async () => {
        if (!prompt && !image) return;
        setStatus('Initializing...');
        setVideoUrl('');
        try {
            let operation = await generateVideoVeo(prompt, aspectRatio, image ?? undefined);
            setStatus('Generating video... this can take a few minutes.');
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await checkVideoOperation(operation);
            }
            const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (uri) {
                const response = await fetch(`${uri}&key=${process.env.API_KEY}`);
                const blob = await response.blob();
                setVideoUrl(URL.createObjectURL(blob));
                setStatus('Video generated successfully!');
            } else {
                setStatus('Failed to get video URI.');
            }
        } catch (e) {
            console.error(e);
            setStatus('An error occurred during video generation.');
            onApiError?.(e);
        }
    };
    
    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 mb-4 text-zinc-400 hover:text-white"><BackIcon className="w-5 h-5"/> Back to Studio</button>
            <h1 className="text-3xl font-bold mb-2">Video Generation</h1>
            <p className="text-zinc-400 mb-6">Generate videos from text or an image using Veo.</p>
            <div className="space-y-4 max-w-xl">
                 <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="A majestic lion roaring on a cliff..." rows={3} className="w-full bg-zinc-700 p-2 rounded-md" />
                 <div>
                    <label className="block text-sm mb-1">Starting Image (Optional)</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-700 file:text-white hover:file:bg-zinc-600"/>
                 </div>
                 <div>
                    <label className="block text-sm mb-1">Aspect Ratio</label>
                    <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value as '16:9' | '9:16')} className="w-full bg-zinc-700 p-2 rounded-md">
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="9:16">9:16 (Portrait)</option>
                    </select>
                </div>
                 <button onClick={handleSubmit} disabled={!!status && !status.includes('successfully')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-zinc-600">{status ? status : 'Generate'}</button>
            </div>
            {videoUrl && <div className="mt-6"><video src={videoUrl} controls className="rounded-lg max-w-md" /></div>}
        </div>
    );
};

const ContentAnalyzerTool: React.FC<ToolProps> = ({ onBack }) => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [useThinking, setUseThinking] = useState(false);
    const [grounding, setGrounding] = useState<'none' | 'search' | 'maps'>('none');
    const [image, setImage] = useState<{ data: string, mimeType: string } | null>(null);
    const [imageUrl, setImageUrl] = useState('');

     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const { data, mimeType } = await fileToBase64(file);
            setImage({ data, mimeType });
            setImageUrl(URL.createObjectURL(file));
        }
    };
    
    const handleSubmit = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setResult('');
        try {
            if (image) {
                const text = await analyzeImage(prompt, image.data, image.mimeType);
                setResult(text);
            } else {
                const model = grounding === 'maps' ? 'gemini-2.5-flash' : (useThinking ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview');
                const { text } = await analyzeContent(prompt, { model, useThinking, grounding: grounding === 'none' ? undefined : grounding });
                setResult(text);
            }
        } catch (e) {
            console.error(e);
            setResult('An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 mb-4 text-zinc-400 hover:text-white"><BackIcon className="w-5 h-5"/> Back to Studio</button>
            <h1 className="text-3xl font-bold mb-2">Content Analyzer</h1>
            <p className="text-zinc-400 mb-6">Ask complex questions, analyze images, and get grounded answers.</p>
             <div className="space-y-4 max-w-2xl">
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="What is this image about? or Who won the last olympics?" rows={5} className="w-full bg-zinc-700 p-2 rounded-md" />
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={useThinking} onChange={e => setUseThinking(e.target.checked)} className="bg-zinc-800" /> Enable Thinking Mode</label>
                    <select value={grounding} onChange={e => setGrounding(e.target.value as any)} className="bg-zinc-700 p-2 rounded-md">
                        <option value="none">No Grounding</option>
                        <option value="search">Google Search</option>
                        <option value="maps">Google Maps</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm mb-1">Upload Image for Analysis (Optional)</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-700 file:text-white hover:file:bg-zinc-600"/>
                 </div>
                 {imageUrl && <img src={imageUrl} alt="upload preview" className="max-w-xs rounded-lg"/>}
                 <button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-zinc-600">{isLoading ? 'Analyzing...' : 'Analyze'}</button>
             </div>
             {result && <div className="mt-6 p-4 bg-zinc-800 rounded-md whitespace-pre-wrap"><p>{result}</p></div>}
        </div>
    );
};

const AudioSuiteTool: React.FC<ToolProps> = ({ onBack }) => {
    // This component can have tabs for Voice Chat, Transcription, TTS
    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 mb-4 text-zinc-400 hover:text-white"><BackIcon className="w-5 h-5"/> Back to Studio</button>
            <h1 className="text-3xl font-bold mb-6">Audio Suite</h1>
            <div className="border border-zinc-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Real-time Voice Chat</h2>
                <VoiceChatComponent />
                <hr className="my-6 border-zinc-700" />
                 <h2 className="text-xl font-semibold mb-4">Text-to-Speech</h2>
                <TextToSpeechComponent />
            </div>
        </div>
    );
};

// FIX: Rewrote VoiceChatComponent to correctly handle Live API audio streaming,
// ensuring gapless playback, interruption handling, and proper resource cleanup.
const VoiceChatComponent: React.FC = () => {
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [transcript, setTranscript] = useState<{speaker: 'user' | 'bot', text: string}[]>([]);
  
  const sessionRef = useRef<LiveSession | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextAudioStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const cleanup = () => {
    sessionRef.current?.close();
    sessionRef.current = null;
    mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    mediaStreamRef.current = null;
    scriptProcessorRef.current?.disconnect();
    scriptProcessorRef.current = null;
    audioContextRef.current?.close().catch(console.error);
    audioContextRef.current = null;
    outputAudioContextRef.current?.close().catch(console.error);
    outputAudioContextRef.current = null;
    
    audioSourcesRef.current.forEach(source => source.stop());
    audioSourcesRef.current.clear();
    nextAudioStartTimeRef.current = 0;
    
    setConnectionState('disconnected');
  };
  
  useEffect(() => {
    return cleanup;
  }, []);

  const handleStart = async () => {
    setConnectionState('connecting');
    setTranscript([]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const sessionPromise = connectToLiveSession({
        onOpen: () => {
            setConnectionState('connected');
            const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = inputCtx;
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = processor;
            processor.onaudioprocess = e => {
                const pcmBlob = createPcmBlob(e.inputBuffer.getChannelData(0));
                sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
        },
        onMessage: async (msg) => {
             if (msg.serverContent?.outputTranscription) {
                const text = msg.serverContent.outputTranscription.text;
                setTranscript(prev => {
                    const last = prev[prev.length - 1];
                    if (last?.speaker === 'bot') return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                    return [...prev, { speaker: 'bot', text }];
                });
            } else if (msg.serverContent?.inputTranscription) {
                const text = msg.serverContent.inputTranscription.text;
                setTranscript(prev => {
                    const last = prev[prev.length - 1];
                    if (last?.speaker === 'user') return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                    return [...prev, { speaker: 'user', text }];
                });
            }
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
                const outputCtx = outputAudioContextRef.current;
                const decodedBytes = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
                const audioBuffer = await decodeAudioData(decodedBytes, outputCtx, 24000, 1);
                const source = outputCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputCtx.destination);
                
                const startTime = Math.max(nextAudioStartTimeRef.current, outputCtx.currentTime);
                source.start(startTime);
                nextAudioStartTimeRef.current = startTime + audioBuffer.duration;
                
                audioSourcesRef.current.add(source);
                source.onended = () => {
                    audioSourcesRef.current.delete(source);
                };
            }
            if (msg.serverContent?.interrupted) {
                audioSourcesRef.current.forEach(source => source.stop());
                audioSourcesRef.current.clear();
                nextAudioStartTimeRef.current = 0;
            }
        },
        onError: () => { setConnectionState('error'); cleanup(); },
        onClose: () => cleanup(),
      });
      sessionRef.current = await sessionPromise;
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    } catch {
      setConnectionState('error');
    }
  };

  return (
      <div>
         {connectionState !== 'connected' ? 
            <button onClick={handleStart} disabled={connectionState === 'connecting'} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:bg-zinc-600">
                {connectionState === 'connecting' ? 'Connecting...' : 'Start Voice Chat'}
            </button> :
            <button onClick={cleanup} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">Stop Voice Chat</button>
         }
         <div className="mt-4 p-2 bg-zinc-900 rounded-md h-32 overflow-y-auto text-sm">
            {transcript.map((t, i) => <div key={i}><span className="font-bold capitalize">{t.speaker}: </span>{t.text}</div>)}
            {transcript.length === 0 && <p className="text-zinc-500 italic">...Waiting for speech...</p>}
         </div>
      </div>
  );
};

const TextToSpeechComponent: React.FC = () => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!text) return;
        setIsLoading(true);
        try {
            const audioBase64 = await generateSpeech(text);
            if (audioBase64) {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                const decodedBytes = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
                const audioBuffer = await decodeAudioData(decodedBytes, audioContext, 24000, 1);
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start();
                source.onended = () => {
                    audioContext.close();
                };
            }
        } catch (e) { console.error(e); } 
        finally { setIsLoading(false); }
    };
    
    return (
        <div>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Hello, World!" rows={3} className="w-full bg-zinc-700 p-2 rounded-md" />
            <button onClick={handleSubmit} disabled={isLoading} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-zinc-600">{isLoading ? 'Generating...' : 'Generate & Play'}</button>
        </div>
    );
};


const GatedImageGenerator = withApiKeyGate(ImageGeneratorTool);
const GatedVideoGenerator = withApiKeyGate(VideoGeneratorTool);
// Re-exporting with new names to avoid confusion in the main component
const ImageGeneratorToolGated: React.FC<ToolProps> = (props) => <GatedImageGenerator {...props} />;
const VideoGeneratorToolGated: React.FC<ToolProps> = (props) => <GatedVideoGenerator {...props} />;


export default AIStudioPage;