
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// Auxiliares de Base64 e Audio (conforme diretrizes)
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveConcierge: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [userSpeech, setUserSpeech] = useState('');
  const [isListening, setIsListening] = useState(false);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const toggleConcierge = async () => {
    if (isActive) {
      stopSession();
    } else {
      await startSession();
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
    setIsListening(false);
    setTranscript('');
    setUserSpeech('');
  };

  const startSession = async () => {
    setIsConnecting(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            setIsListening(true);
            
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscript(prev => prev + message.serverContent!.outputTranscription!.text);
            } else if (message.serverContent?.inputTranscription) {
              setUserSpeech(prev => prev + message.serverContent!.inputTranscription!.text);
            }

            if (message.serverContent?.turnComplete) {
              setTranscript('');
              setUserSpeech('');
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Erro Live API:', e);
            stopSession();
          },
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: 'Você é o Concierge Digital do Grupo CBL. Seja profissional, inovador e prestativo. Ajude o usuário a entender que a CBL cria soluções tecnológicas de elite, sites de alta performance e sistemas sob medida. Fale em Português do Brasil.',
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Falha ao iniciar concierge:', err);
      setIsConnecting(false);
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button 
        onClick={toggleConcierge}
        className={`fixed bottom-8 right-8 z-[60] w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isActive ? 'bg-red-600 scale-110' : 'bg-white hover:scale-110'}`}
      >
        {isConnecting ? (
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        ) : isActive ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
        )}
      </button>

      {/* Painel de Conversa */}
      <div className={`fixed bottom-28 right-8 z-[55] w-[90vw] max-w-sm transition-all duration-500 transform ${isActive ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-red-600/20 p-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Live AI Concierge CBL</h4>
          </div>
          
          <div className="p-6 space-y-4">
            {userSpeech && (
              <div className="bg-white/5 p-3 rounded-lg border-l-2 border-white/20">
                <p className="text-[10px] uppercase text-gray-500 mb-1 font-bold">Você</p>
                <p className="text-sm text-gray-300 italic">"{userSpeech}"</p>
              </div>
            )}
            
            <div className="min-h-[100px] flex flex-col justify-end">
              <p className="text-[10px] uppercase text-red-500 mb-1 font-bold">CBL AI</p>
              <p className="text-base text-white leading-relaxed font-light">
                {transcript || (isListening ? 'Estou ouvindo... Como posso ajudar o seu negócio hoje?' : 'Iniciando conexão...')}
              </p>
            </div>
            
            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <div className="flex-grow h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 animate-[pulse_1s_infinite]" style={{ width: '40%' }}></div>
                </div>
                <span className="text-[8px] font-mono text-gray-500 uppercase">PCM_STREAM_ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveConcierge;
