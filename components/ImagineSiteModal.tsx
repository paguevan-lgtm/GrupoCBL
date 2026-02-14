
import { GoogleGenAI, Type } from '@google/genai';
import React, { useEffect, useState } from 'react';
import { XIcon } from './icons/XIcon';

interface ProjectFiles {
  'index.html'?: string;
  'theme.css'?: string;
  'interactions.js'?: string;
}

const ImagineSiteModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'loading' | 'preview'>('form');
  const [formData, setFormData] = useState({
    companyName: '',
    essence: '',
  });
  const [progress, setProgress] = useState(0);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFiles | null>(null);
  const [error, setError] = useState<{ message: string; technical?: string; keyDebug?: string } | null>(null);

  const logs = [
    "Iniciando Motor de Draft CBL...",
    "Sincronizando com Google Flash Engine...",
    "Validando tokens de segurança...",
    "Arquitetando design system customizado...",
    "Gerando código-fonte otimizado...",
    "Draft pronto para visualização."
  ];

  useEffect(() => {
    let logInterval: number;
    if (step === 'loading') {
      let currentLogIndex = 0;
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
      }, 200);
    }
    return () => clearInterval(logInterval);
  }, [step]);

  const generateFullWebsite = async () => {
    setStep('loading');
    setError(null);

    const rawKey = process.env.API_KEY || "";
    // Limpeza profunda para evitar caracteres invisíveis
    const apiKey = rawKey.replace(/[^a-zA-Z0-9\-_]/g, '').trim();
    
    const maskedKey = apiKey.length > 8 
        ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`
        : "NÃO CONFIGURADA";

    if (!apiKey || apiKey.toLowerCase().includes("placeholder") || apiKey.length < 20) {
      setError({ 
        message: 'Configuração Incorreta detectada.', 
        technical: 'O site ainda está lendo a chave "PLACEHOLDER". Você precisa atualizar o valor da variável API_KEY no seu painel de controle (Vercel).',
        keyDebug: maskedKey
      });
      setStep('form');
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Crie um website profissional completo para a empresa "${formData.companyName}". 
      Objetivo: ${formData.essence}. 
      O HTML deve ser moderno, usando Tailwind CSS (via CDN) e ser totalmente responsivo.`;

      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config: { 
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              'index.html': { type: Type.STRING, description: 'O código HTML completo do site.' },
              'theme.css': { type: Type.STRING, description: 'Estilos CSS extras (opcional).' },
              'interactions.js': { type: Type.STRING, description: 'Lógica JS para o site.' }
            },
            required: ['index.html']
          }
        }
      });

      const files = JSON.parse(response.text || '{}') as ProjectFiles;
      setProjectFiles(files);
      setProgress(100);
      setStep('preview');
    } catch (err: any) {
      console.error("Critical API Error:", err);
      const msg = err?.message || "";
      const isKeyError = msg.includes("400") || msg.includes("API key not valid") || msg.includes("INVALID_ARGUMENT");
      
      setError({ 
        message: isKeyError ? 'Chave Inválida ou Expirada.' : 'Falha na Comunicação CBL.', 
        keyDebug: maskedKey,
        technical: isKeyError 
          ? 'O Google recusou a chave. Verifique se copiou corretamente e se o serviço "Generative Language API" está ativo no seu AI Studio.' 
          : 'Erro técnico: ' + msg
      });
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-0 md:p-4">
      <div className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-[#050505] md:rounded-3xl border border-white/10 flex flex-col overflow-hidden">
        
        <div className="bg-[#0c0c0c] border-b border-white/10 p-4 flex justify-between items-center px-6 shrink-0 h-16">
          <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">CBL_SYSTEM_FLASH_v2.5</span>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-all"><XIcon /></button>
        </div>

        {step === 'form' && (
          <div className="flex-grow flex items-center justify-center p-8 overflow-y-auto">
            <div className="w-full max-w-2xl space-y-8">
              <div className="text-center">
                <h2 className="text-5xl font-black tracking-tighter uppercase italic text-white leading-none">
                  Draft <span className="text-red-600">Flash</span>
                </h2>
                <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Geração Instantânea via AI Studio</p>
              </div>

              <div className="space-y-4">
                <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="Nome da Empresa" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white outline-none focus:border-red-600 transition-colors" 
                />
                <textarea 
                    value={formData.essence}
                    onChange={(e) => setFormData({...formData, essence: e.target.value})}
                    placeholder="Descreva o que o site deve conter..." 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white h-32 outline-none focus:border-red-600 resize-none transition-colors" 
                />
              </div>

              <div className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg text-center">
                    <p className="text-red-500 font-bold uppercase text-xs">{error.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-mono">ID no Sistema: <span className="text-white underline">{error.keyDebug}</span></p>
                    <p className="text-[10px] text-gray-500 font-mono mt-2 italic">{error.technical}</p>
                  </div>
                )}
                <button 
                  onClick={generateFullWebsite}
                  disabled={!formData.companyName}
                  className="w-full bg-white text-black py-5 rounded-lg font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-20 shadow-xl shadow-white/5"
                >
                  Gerar Draft Agora
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-8"></div>
            <div className="w-full max-w-sm space-y-4">
               <div className="bg-white/5 rounded-xl p-6 h-40 overflow-y-auto font-mono text-[10px] text-white/40 text-left border border-white/10">
                  {buildLogs.map((log, i) => <div key={i} className="mb-1">{log}</div>)}
                  <div className="animate-pulse">_</div>
               </div>
               <div className="text-xs text-white/20 uppercase tracking-widest font-bold">Processando via Gemini Flash...</div>
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <iframe 
            srcDoc={projectFiles['index.html']}
            className="flex-grow w-full h-full border-none bg-white"
            title="Site Draft Preview"
          />
        )}
      </div>
    </div>
  );
};

export default ImagineSiteModal;
