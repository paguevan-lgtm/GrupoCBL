
import { GoogleGenAI } from '@google/genai';
import React, { useEffect, useRef, useState } from 'react';
import { XIcon } from './icons/XIcon';

interface ProjectFiles {
  'index.html'?: string;
  'theme.css'?: string;
  'interactions.js'?: string;
  'README.md'?: string;
}

const ImagineSiteModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'loading' | 'preview'>('form');
  const [isCtaVisible, setIsCtaVisible] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    styleDescription: '',
    referenceUrl: '',
    essence: '',
  });
  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFiles | null>(null);
  const [error, setError] = useState<{ message: string; technical?: string; keyDebug?: string } | null>(null);

  const logs = [
    "Iniciando Sistema de Draft Grupo CBL...",
    "Conectando com Google AI Studio (Gemini 3 Flash)...",
    "Validando credenciais de engenharia...",
    "Gerando design tokens personalizados...",
    "Arquitetando layout mobile-first...",
    "Implementando interações de alto padrão...",
    "Draft pronto para visualização."
  ];

  useEffect(() => {
    let logInterval: number;
    let timerInterval: number;

    if (step === 'loading') {
      let currentLogIndex = 0;
      setElapsedSeconds(0);
      timerInterval = window.setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
      logInterval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) return prev; 
          const next = prev + 2;
          const logThreshold = (currentLogIndex + 1) * (100 / logs.length);
          if (next >= logThreshold && currentLogIndex < logs.length) {
            setBuildLogs(prevLogs => [...prevLogs, `> ${logs[currentLogIndex]}`]);
            currentLogIndex++;
          }
          return next;
        });
      }, 250);
    }
    return () => { clearInterval(logInterval); clearInterval(timerInterval); };
  }, [step]);

  const generateFullWebsite = async () => {
    setStep('loading');
    setError(null);

    // SANITIZAÇÃO: Remove qualquer coisa que não seja letra, número, hífen ou underline
    const rawApiKey = process.env.API_KEY || "";
    const cleanKey = rawApiKey.replace(/[^a-zA-Z0-9\-_]/g, '').trim();
    
    const maskedKey = cleanKey.length > 8 
      ? `${cleanKey.substring(0, 5)}...${cleanKey.substring(cleanKey.length - 4)}`
      : "Chave Ausente ou Inválida";

    if (!cleanKey || cleanKey.length < 15) {
      setError({ 
        message: 'Variável de API não configurada.', 
        technical: 'O sistema não encontrou a chave no ambiente do Vercel.',
        keyDebug: maskedKey
      });
      setStep('form');
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: cleanKey });
      const prompt = `Crie um website profissional JSON para a empresa ${formData.companyName}. Estilo: ${formData.styleDescription}. Essência: ${formData.essence}. Retorne JSON: { "index.html": "...", "theme.css": "...", "interactions.js": "..." }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const files = JSON.parse(response.text || '{}');
      setProjectFiles(files);
      setProgress(100);
      setStep('preview');
    } catch (err: any) {
      console.error("ImagineSite Error:", err);
      const isInvalidKey = err?.message?.includes("400") || err?.message?.includes("API key not valid");
      setError({ 
        message: isInvalidKey ? 'Chave Recusada pelo Google.' : 'Erro na Geração do Draft.', 
        keyDebug: maskedKey,
        technical: isInvalidKey ? 'Sua chave foi enviada, mas o Google a rejeitou como inválida. Verifique se copiou corretamente.' : err.message
      });
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-0 md:p-4">
      <div className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-[#050505] md:rounded-3xl border border-white/10 flex flex-col overflow-hidden">
        <div className="bg-[#0c0c0c] border-b border-white/10 p-4 flex justify-between items-center px-6">
          <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">CBL_ENGINE_V9.0_FLASH</span>
          <button onClick={onClose} className="text-white/40 hover:text-white"><XIcon /></button>
        </div>

        {step === 'form' && (
          <div className="flex-grow flex items-center justify-center p-8 overflow-y-auto">
            <div className="w-full max-w-2xl space-y-8">
              <div className="text-center">
                <h2 className="text-5xl font-black uppercase italic text-white tracking-tighter">Draft <span className="text-red-600">Flash</span></h2>
                <p className="text-gray-500 text-sm mt-2 tracking-widest uppercase">Visualização Instantânea de Projeto</p>
              </div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  placeholder="Nome da Empresa" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white outline-none focus:border-red-600 transition-all" 
                />
                <textarea 
                  value={formData.essence}
                  onChange={(e) => setFormData({...formData, essence: e.target.value})}
                  placeholder="O que sua empresa faz?" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white h-32 outline-none focus:border-red-600 resize-none transition-all" 
                />
              </div>

              {error && (
                <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg text-center space-y-2">
                  <p className="text-red-500 font-bold text-xs uppercase">{error.message}</p>
                  <p className="text-[10px] text-gray-400 font-mono">Chave no Sistema: <span className="text-white">{error.keyDebug}</span></p>
                  <p className="text-[9px] text-gray-500 italic">{error.technical}</p>
                </div>
              )}

              <button 
                onClick={generateFullWebsite}
                disabled={!formData.companyName}
                className="w-full bg-white text-black py-5 rounded-lg font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all disabled:opacity-20"
              >
                Engenhar Website
              </button>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-8"></div>
            <div className="w-full max-w-sm bg-white/5 p-4 rounded-xl border border-white/10 font-mono text-[10px] text-white/40 h-40 overflow-y-auto">
              {buildLogs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <iframe srcDoc={projectFiles['index.html']} className="flex-grow w-full h-full border-none bg-white" />
        )}
      </div>
    </div>
  );
};

export default ImagineSiteModal;
