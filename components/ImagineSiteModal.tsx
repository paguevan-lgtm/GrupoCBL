
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
  const [error, setError] = useState<{ message: string; isQuota: boolean } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const logs = [
    "Iniciando Sistema de Draft Grupo CBL...",
    "Validando credenciais de alta performance...",
    "Clonando repositório de elite...",
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

  const checkAndGenerate = async () => {
    // Para modelos Pro, precisamos garantir que o usuário tenha uma chave paga selecionada
    if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await handleOpenSelectKey();
            // Após abrir o diálogo, assumimos sucesso conforme diretriz e procedemos
        }
    }
    generateFullWebsite();
  };

  const generateFullWebsite = async () => {
    setStep('loading');
    setError(null);
    setBuildLogs(["> Acionando Engenharia Grupo CBL v8.0 (Enterprise Pro Core)..."]);

    // Criamos uma nova instância logo antes da chamada para garantir o uso da chave mais recente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Você é um Lead Developer & UI Designer de Elite na CBL Tech.
      Sua tarefa é criar um projeto de website institucional COMPLETO, ÚNICO e PROFISSIONAL.
      
      DADOS DO CLIENTE:
      Empresa: ${formData.companyName}
      Estilo: ${formData.styleDescription || 'Premium modern luxury'}
      Referência: ${formData.referenceUrl || 'Nenhuma'}
      Essência: ${formData.essence}

      DIRETRIZES DE DESIGN CRÍTICAS (MOBILE-FIRST):
      1. ZERO SOBREPOSIÇÃO: O menu de navegação JAMAIS deve cobrir o título principal.
      2. ESPAÇAMENTO VERTICAL: Cada seção deve ter margens claras (py-12 no mobile).
      3. TIPOGRAFIA: Use fontes elegantes e modernas.
      4. IMAGENS: Use Unsplash para fotos realistas.
      
      IMPORTANTE: Não mencione "IA" ou "Inteligência Artificial" no site.
      O site deve parecer feito sob medida por especialistas.
      
      RETORNO OBRIGATÓRIO (JSON):
      Retorne um objeto JSON com: 'index.html', 'theme.css', 'interactions.js', 'README.md'.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          responseMimeType: 'application/json',
          temperature: 0.85 
        }
      });

      const responseText = response.text || '{}';
      const files = JSON.parse(responseText) as ProjectFiles;
      
      let previewHtml = files['index.html'] || '<html><body style="background:#000;color:#fff;">Erro no draft.</body></html>';
      
      const globalStyles = `<style>html, body { overflow-x: hidden; width: 100%; margin: 0; padding: 0; }</style>`;
      const imageFallbackScript = `
        <script>
          function applyFallback(img) {
            img.onerror = null;
            const keywords = "${formData.essence}".split(' ').slice(0, 3).join(',');
            img.src = "https://source.unsplash.com/800x600/?" + keywords;
          }
          window.addEventListener('load', () => {
            document.querySelectorAll('img').forEach(img => {
              if (!img.complete || img.naturalWidth === 0) applyFallback(img);
              img.onerror = () => applyFallback(img);
            });
          });
        </script>
      `;

      if (files['theme.css']) {
        previewHtml = previewHtml.replace('</head>', `<style>${files['theme.css']}</style></head>`);
      }
      previewHtml = previewHtml.replace('</head>', `${globalStyles}${imageFallbackScript}</head>`);
      
      if (files['interactions.js']) {
        previewHtml = previewHtml.replace('</body>', `<script>${files['interactions.js']}</script></body>`);
      }
      
      setProjectFiles({ ...files, 'index.html': previewHtml });
      setProgress(100);
      setTimeout(() => setStep('preview'), 800);
    } catch (err: any) {
      console.error("ImagineSiteModal Error:", err);
      
      // Tratamento de erro específico para reset de chave conforme diretriz
      if (err?.message?.includes("Requested entity was not found") || err?.status === 404) {
          setError({ message: 'Conexão com API Pro falhou. Por favor, re-selecione sua chave de faturamento.', isQuota: true });
          if (window.aistudio?.openSelectKey) window.aistudio.openSelectKey();
      } else if (err?.status === 429 || err?.message?.includes("quota")) {
        setError({ message: 'Limite de requisições Pro excedido. Configure sua chave paga.', isQuota: true });
      } else {
        setError({ message: 'Erro na engenharia de draft. Tente novamente em breve.', isQuota: false });
      }
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl overflow-hidden p-0 md:p-2">
      <div className="relative w-full h-full md:w-[98vw] md:h-[96vh] bg-[#050505] md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* IDE Control Bar */}
        <div className="bg-[#0c0c0c] border-b border-white/10 p-2.5 md:p-4 flex justify-between items-center px-4 md:px-6 shrink-0 h-14 md:h-16">
          <div className="flex items-center gap-2 md:gap-4">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
             </div>
             <span className="text-[8px] md:text-[10px] font-mono text-white/30 tracking-widest uppercase flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
                <span className="animate-pulse text-red-600">●</span> CBL_ENTERPRISE_CORE_V8
             </span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 p-2 rounded-lg">
            <XIcon />
          </button>
        </div>

        {step === 'form' && (
          <div className="flex-grow flex items-start md:items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-5xl space-y-8 md:space-y-12 py-4">
              <div className="text-center space-y-3">
                <h2 className="text-3xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-white leading-none">
                  Futuro <span className="text-red-600">Digital</span>
                </h2>
                <p className="text-gray-400 text-xs md:text-lg lg:text-xl max-w-2xl mx-auto font-light px-2">
                  Visualize agora a infraestrutura de elite que o Grupo CBL pode construir para você.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-4">
                   <div className="group">
                      <label className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Empresa</label>
                      <input 
                        type="text" 
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        placeholder="Nome da sua marca" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none transition-all" 
                      />
                   </div>
                   <div className="group">
                      <label className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Estilo</label>
                      <input 
                        type="text" 
                        value={formData.styleDescription}
                        onChange={(e) => setFormData({...formData, styleDescription: e.target.value})}
                        placeholder="Ex: Futurista, minimalista, escuro..." 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none transition-all" 
                      />
                   </div>
                </div>
                <div className="group">
                    <label className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Diferenciais</label>
                    <textarea 
                      value={formData.essence}
                      onChange={(e) => setFormData({...formData, essence: e.target.value})}
                      placeholder="O que torna seu negócio único?" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none transition-all h-28 md:h-[116px] resize-none" 
                    />
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={checkAndGenerate}
                  disabled={!formData.companyName || !formData.essence}
                  className="w-full bg-white text-black py-4 md:py-6 rounded-lg font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all disabled:opacity-20 flex items-center justify-center gap-3 text-xs md:text-sm"
                >
                  Engenhar Projeto de Elite
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>

                {error && (
                  <div className="text-center space-y-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-500 font-mono text-[10px] md:text-xs">{error.message}</p>
                    {error.isQuota && (
                      <div className="flex items-center justify-center gap-4">
                         <button onClick={handleOpenSelectKey} className="text-[10px] font-bold uppercase tracking-widest text-white border border-white/20 px-4 py-2 rounded hover:bg-white/10">Configurar Chave API</button>
                         <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[9px] text-gray-500 underline uppercase">Faturamento</a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-grow flex flex-col items-center justify-center p-6 bg-black relative">
            <div className="w-24 h-24 border-2 border-red-600/5 rounded-full flex items-center justify-center mb-8">
                 <div className="absolute inset-0 border-t-2 border-red-600 rounded-full animate-spin"></div>
                 <div className="w-16 h-16 border border-white/5 rounded-full flex items-center justify-center bg-white/[0.02] animate-pulse text-red-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
            </div>

            <div className="w-full max-w-lg space-y-6">
               <div className="bg-[#080808] border border-white/5 rounded-xl p-6 h-48 overflow-y-auto font-mono text-[9px] md:text-xs custom-scrollbar">
                  {buildLogs.map((log, i) => (
                    <div key={i} className={`${i === buildLogs.length - 1 ? 'text-white' : 'text-white/10'} mb-2 flex gap-3`}>
                      <span className="text-red-900/40 select-none">[{new Date().toLocaleTimeString()}]</span>
                      <span>{log}</span>
                    </div>
                  ))}
               </div>
               <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase italic">Gerando Draft Estratégico...</h3>
                  <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {step === 'preview' && projectFiles && (
          <div className="flex-grow flex flex-col h-full overflow-hidden relative">
            {isCtaVisible && (
              <div className="bg-red-600 text-white p-3 md:p-4 shrink-0 shadow-2xl z-[110] border-b border-black/10 flex items-center justify-center">
                 <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                       <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full border border-white/10">Estudo Preliminar CBL</span>
                       <p className="text-[7px] md:text-[9px] uppercase tracking-wider text-white/80 hidden sm:block">Este é um rascunho. O projeto final será superior.</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => setStep('form')} className="bg-black/10 py-2 px-4 rounded text-[8px] md:text-[10px] font-black border border-white/5">Novo Draft</button>
                       <button onClick={() => { onClose(); window.location.hash = '#contact'; }} className="bg-white text-red-600 px-6 py-2 rounded text-[8px] md:text-[10px] font-black shadow-lg">Contratar CBL</button>
                    </div>
                 </div>
              </div>
            )}
            <iframe ref={iframeRef} srcDoc={projectFiles['index.html']} className="w-full h-full border-none bg-white" title="CBL Draft" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagineSiteModal;
