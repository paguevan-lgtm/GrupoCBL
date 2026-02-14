
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
  const [error, setError] = useState<{ message: string; isQuota: boolean; technical?: string } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const logs = [
    "Iniciando Sistema de Draft Grupo CBL...",
    "Validando infraestrutura de rede segura...",
    "Escaneando identidade visual e referências...",
    "Gerando design tokens personalizados...",
    "Arquitetando layout mobile-first...",
    "Escrevendo estrutura com boas práticas de SEO...",
    "Implementando interações de alto padrão...",
    "Otimizando ativos para carregamento rápido...",
    "Executando auditoria final de interface...",
    "Projeto pronto para visualização."
  ];

  useEffect(() => {
    let logInterval: number;
    let timerInterval: number;

    if (step === 'loading') {
      let currentLogIndex = 0;
      setElapsedSeconds(0);
      
      timerInterval = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);

      logInterval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) return prev; 
          const next = prev + (Math.random() * 2);
          const logThreshold = (currentLogIndex + 1) * (100 / logs.length);
          if (next >= logThreshold && currentLogIndex < logs.length) {
            const nextLog = logs[currentLogIndex];
            if (nextLog) {
              setBuildLogs(prevLogs => [...prevLogs, `> ${nextLog}`]);
            }
            currentLogIndex++;
          }
          return next;
        });
      }, 180);
    } else {
      setProgress(0);
      setBuildLogs([]);
    }

    return () => {
      clearInterval(logInterval);
      clearInterval(timerInterval);
    };
  }, [step]);

  const handleOpenSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setError(null);
    }
  };

  const generateFullWebsite = async () => {
    setStep('loading');
    setError(null);

    const apiKey = process.env.API_KEY;
    
    // Verificação de segurança da chave
    if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
      setError({ 
        message: 'Configuração da API CBL Pendente.', 
        isQuota: false, 
        technical: 'A variável API_KEY não foi injetada corretamente ou é inválida. Verifique o painel do Vercel.' 
      });
      setStep('form');
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Crie um website profissional JSON para a empresa ${formData.companyName}.
      Estilo: ${formData.styleDescription}. Essência do negócio: ${formData.essence}.
      Retorne JSON: { "index.html": "...", "theme.css": "...", "interactions.js": "..." }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const responseText = response.text || '{}';
      const files = JSON.parse(responseText) as ProjectFiles;
      
      setProjectFiles(files);
      setProgress(100);
      setTimeout(() => {
        setStep('preview');
        setIsCtaVisible(true);
      }, 800);
    } catch (err: any) {
      console.error("ImagineSiteModal API Error:", err);
      const isQuotaError = err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("quota");
      
      setError({ 
        message: isQuotaError ? 'Limite de Requisições Excedido.' : 'Falha na Engenharia do Draft.', 
        isQuota: isQuotaError,
        technical: err?.message || 'Erro de comunicação desconhecido.'
      });
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl overflow-hidden p-0 md:p-2">
      <div className="relative w-full h-full md:w-[98vw] md:h-[96vh] bg-[#050505] md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        <div className="bg-[#0c0c0c] border-b border-white/10 p-2.5 md:p-4 flex justify-between items-center px-4 md:px-6 shrink-0 h-14 md:h-16">
          <div className="flex items-center gap-2 md:gap-4">
             <span className="text-[8px] md:text-[10px] font-mono text-white/30 tracking-widest uppercase flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
                CBL_DRAFT_SYSTEM_V8.1
             </span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 p-2 rounded-lg">
            <XIcon />
          </button>
        </div>

        {step === 'form' && (
          <div className="flex-grow flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-5xl space-y-8 md:space-y-12 py-4">
              <div className="text-center">
                <h2 className="text-3xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-white leading-none">
                  Draft <span className="text-red-600">Pro</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="Nome da Empresa" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 md:py-4 text-white outline-none focus:border-red-600" 
                />
                <input 
                    type="text" 
                    value={formData.styleDescription}
                    onChange={(e) => setFormData({...formData, styleDescription: e.target.value})}
                    placeholder="Estilo (Ex: Moderno, Minimalista)" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 md:py-4 text-white outline-none focus:border-red-600" 
                />
              </div>

              <textarea 
                value={formData.essence}
                onChange={(e) => setFormData({...formData, essence: e.target.value})}
                placeholder="Qual o diferencial do negócio?" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 md:py-4 text-white h-32 outline-none focus:border-red-600 resize-none" 
              />

              <div className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg text-center">
                    <p className="text-red-500 font-bold uppercase text-xs tracking-widest">{error.message}</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-1 opacity-70 italic">{error.technical}</p>
                    {error.isQuota && (
                      <button onClick={handleOpenSelectKey} className="mt-2 text-[10px] text-white underline block mx-auto">Configurar Chave Própria</button>
                    )}
                  </div>
                )}
                <button 
                  onClick={generateFullWebsite}
                  disabled={!formData.companyName}
                  className="w-full bg-white text-black py-4 md:py-6 rounded-lg font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-30"
                >
                  Engenhar Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center p-6 bg-black">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-8"></div>
            <div className="w-full max-w-lg space-y-4">
               <div className="bg-[#080808] border border-white/5 rounded-xl p-4 h-40 overflow-y-auto font-mono text-[10px] text-white/40">
                  {buildLogs.map((log, i) => <div key={i}>{log}</div>)}
               </div>
               <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <iframe 
            srcDoc={projectFiles['index.html']}
            className="flex-grow w-full h-full border-none bg-white"
          />
        )}
      </div>
    </div>
  );
};

export default ImagineSiteModal;
