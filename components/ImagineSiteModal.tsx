
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
  const [formData, setFormData] = useState({ companyName: '', essence: '' });
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFiles | null>(null);
  const [error, setError] = useState<string | null>(null);

  const logs = [
    "Iniciando Motor CBL Flash...",
    "Conectando ao Google AI Studio...",
    "Processando requisição de design...",
    "Gerando código-fonte responsivo...",
    "Finalizando draft estrutural..."
  ];

  useEffect(() => {
    let logInterval: number;
    if (step === 'loading') {
      let idx = 0;
      logInterval = window.setInterval(() => {
        if (idx < logs.length) {
          setBuildLogs(prev => [...prev, `> ${logs[idx]}`]);
          idx++;
        }
      }, 400);
    }
    return () => clearInterval(logInterval);
  }, [step]);

  const generateFullWebsite = async () => {
    setStep('loading');
    setError(null);
    setBuildLogs([]);

    try {
      // Cria a instância no momento da chamada para garantir o valor atual da env
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      
      const prompt = `Crie um website profissional completo para a empresa "${formData.companyName}". 
      Contexto: ${formData.essence}. 
      Retorne um objeto JSON puro com as chaves "index.html", "theme.css" e "interactions.js". 
      Use Tailwind CSS via CDN no HTML.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              'index.html': { type: Type.STRING },
              'theme.css': { type: Type.STRING },
              'interactions.js': { type: Type.STRING }
            },
            required: ['index.html']
          }
        }
      });

      const files = JSON.parse(response.text || '{}') as ProjectFiles;
      setProjectFiles(files);
      setStep('preview');
    } catch (err: any) {
      console.error("Gemini Error:", err);
      setError(err.message || "Ocorreu um erro ao conectar com a inteligência artificial.");
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-4">
      <div className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-[#050505] md:rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        
        <div className="bg-[#0c0c0c] border-b border-white/10 p-4 flex justify-between items-center px-6 shrink-0">
          <span className="text-[10px] font-mono text-red-600 tracking-widest uppercase font-bold animate-pulse">CBL_ENGINE_ACTIVE</span>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-all"><XIcon /></button>
        </div>

        {step === 'form' && (
          <div className="flex-grow flex items-center justify-center p-8 overflow-y-auto">
            <div className="w-full max-w-xl space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">
                  Draft <span className="text-red-600">Flash</span>
                </h2>
                <p className="text-gray-500 mt-2 text-xs uppercase tracking-[0.3em]">IA de Alta Performance</p>
              </div>

              <div className="space-y-4">
                <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="Nome da sua Empresa" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600 transition-all" 
                />
                <textarea 
                    value={formData.essence}
                    onChange={(e) => setFormData({...formData, essence: e.target.value})}
                    placeholder="O que o site deve transmitir?" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white h-32 outline-none focus:border-red-600 resize-none transition-all" 
                />
              </div>

              <div className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-xl text-center">
                    <p className="text-red-500 font-bold uppercase text-[10px]">Falha na Autenticação / Conexão</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-mono break-all">{error}</p>
                  </div>
                )}
                <button 
                  onClick={generateFullWebsite}
                  disabled={!formData.companyName}
                  className="w-full bg-white text-black py-5 rounded-xl font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-20"
                >
                  Gerar Agora
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center p-6 bg-black">
            <div className="w-20 h-20 border-t-4 border-red-600 border-r-4 border-transparent rounded-full animate-spin mb-10"></div>
            <div className="w-full max-w-sm font-mono text-[10px] text-red-500/60 bg-red-600/5 p-6 rounded-2xl border border-red-600/20">
               {buildLogs.map((log, i) => <div key={i} className="mb-2">{log}</div>)}
               <div className="animate-pulse">_ EXEC_PROCESS</div>
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
