import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Search, Globe, Instagram, BarChart3, ArrowRight, CheckCircle2, Zap, Target, AlertTriangle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ProjectAnalyzerProps {
  isOpen: boolean;
  onClose: () => void;
}

const loadingTexts = [
  { text: "Conectando ao banco de dados global...", icon: Globe },
  { text: "Verificando indexação no Google...", icon: Search },
  { text: "Comparando com concorrentes do nicho...", icon: Target },
  { text: "Identificando falhas no funil de vendas...", icon: AlertTriangle },
  { text: "Calculando perda de receita atual...", icon: BarChart3 },
  { text: "Compilando estratégia de dominação...", icon: Zap },
];

// Helper component to parse and render Markdown-like syntax
const MarkdownRenderer = ({ content }: { content: string }) => {
  if (!content) return null;

  // Split content by newlines to handle block elements
  const lines = content.split('\n');

  // Helper to parse bold syntax (**text**) within a line
  const parseInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-white font-bold text-shadow-sm">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-2" />; // Spacer for empty lines

        // Headers (## Title)
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={index} className="text-xl md:text-2xl font-display font-bold text-cbl-red mt-6 mb-3 border-b border-white/10 pb-2 uppercase tracking-wide">
              {trimmed.replace('## ', '')}
            </h3>
          );
        }
        
        // Subheaders (### Title)
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={index} className="text-lg font-bold text-white mt-4 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cbl-red" />
              {parseInlineStyles(trimmed.replace('### ', ''))}
            </h4>
          );
        }

        // List Items (- Item or * Item)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={index} className="flex items-start gap-3 ml-2 mb-2 group">
              <span className="text-cbl-red mt-1.5 text-xs opacity-70 group-hover:opacity-100 transition-opacity">➤</span>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                {parseInlineStyles(trimmed.replace(/^[\-\*]\s/, ''))}
              </p>
            </div>
          );
        }

        // Standard Paragraphs
        return (
          <p key={index} className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
            {parseInlineStyles(line)}
          </p>
        );
      })}
    </div>
  );
};

const ProjectAnalyzer: React.FC<ProjectAnalyzerProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'analyzing' | 'result'>('form');
  const [analysis, setAnalysis] = useState<string>('');
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    instagram: '',
    revenue: '',
    goal: '',
    whatsapp: '',
    ads: '',
    competitor: '',
    challenge: '',
    salesProcess: ''
  });

  // Cycle through loading texts
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'analyzing') {
      interval = setInterval(() => {
        setLoadingIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 2000); // Change text every 2 seconds
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateAnalysis = async () => {
    setStep('analyzing');
    setLoadingIndex(0);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        Atue como o SISTEMA DE INTELIGÊNCIA DE MERCADO DO "GRUPO CBL".
        NÃO se identifique como IA. Você é um algoritmo de análise de negócios.

        MISSÃO CRÍTICA:
        Realize uma varredura na web e cruze com os dados estratégicos fornecidos para encontrar o PONTO FRACO do negócio.

        DADOS FORNECIDOS PELO USUÁRIO:
        - Empresa: ${formData.name}
        - Site Atual: ${formData.website}
        - Instagram: ${formData.instagram}
        - Faturamento Atual: ${formData.revenue}
        - Objetivo: ${formData.goal}
        - Investimento Ads: ${formData.ads}
        - Como vende: ${formData.salesProcess}
        - DOR/DESAFIO: ${formData.challenge}
        - Concorrente: ${formData.competitor}

        REGRAS DE FORMATAÇÃO (IMPORTANTE):
        - A resposta DEVE usar Markdown estruturado para facilitar a leitura.
        - Use "## TÍTULO EM MAIÚSCULO" para separar seções.
        - Use "**negrito**" para destacar números, problemas críticos e pontos fortes.
        - Use listas ("- item") para listar problemas ou soluções.
        - NÃO use hashtags soltas (#) no meio do texto, apenas no início da linha para títulos.

        ESTRUTURA DO RELATÓRIO:

        ## 1. DIAGNÓSTICO DE VISIBILIDADE
        Analise a presença digital. O concorrente ${formData.competitor} ganha? O processo "${formData.salesProcess}" é escalável?
        
        ## 2. A CAUSA RAIZ: ${formData.challenge}
        Explique por que o desafio acontece. Conecte com a falta de tecnologia/site/automação. Critique o ROI do ads (${formData.ads}) se não houver funil.

        ## 3. SOLUÇÃO TÁTICA CBL
        - **Ecossistema:** Site de Alta Conversão.
        - **Automação:** Resolver o gargalo manual.
        - **Tráfego:** Estratégia correta.

        ## 4. PROJEÇÃO DE CENÁRIO
        O que acontece em 6 meses se nada mudar versus com a CBL.

        ---
        **Nota:** Os valores, percentuais e projeções apresentados são estimativas baseadas em benchmarks de mercado e nos dados fornecidos. Resultados reais variam conforme fatores externos, sazonalidade e execução estratégica.
        
        TOM DE VOZ:
        Profissional, Direto, Impactante.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      setAnalysis(response.text || "Análise concluída. Entre em contato para detalhes.");
      setStep('result');
    } catch (error) {
      console.error("Erro na análise:", error);
      setAnalysis("Falha na conexão com o servidor de análise. Por favor, tente novamente ou fale direto no WhatsApp para uma análise manual.");
      setStep('result');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateAnalysis();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-cbl-black/95 backdrop-blur-md" 
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-cbl-red w-5 h-5" />
              <h3 className="font-display font-bold text-white tracking-wide">RAIO-X DE NEGÓCIOS</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto custom-scrollbar min-h-[400px]">
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Diagnóstico Estratégico</h2>
                  <p className="text-gray-400 text-sm">
                    Preencha os dados reais. O sistema identificará gargalos ocultos que impedem seu lucro de escalar.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Nome do Empreendimento" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ex: Tech Solutions" required />
                  <InputGroup label="Link (Site ou Google)" name="website" value={formData.website} onChange={handleInputChange} placeholder="www.suaempresa.com" />
                  <InputGroup label="Link do Instagram" name="instagram" value={formData.instagram} onChange={handleInputChange} placeholder="@seuinsta" />
                  <InputGroup label="WhatsApp Comercial" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="(11) 99999-9999" required />
                  
                  {/* Strategic Section */}
                  <div className="md:col-span-2 space-y-4 p-5 bg-white/5 rounded border border-white/5">
                     <h4 className="text-cbl-red text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Target size={14} /> Dados de Performance
                     </h4>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="Faturamento Médio Mensal" name="revenue" value={formData.revenue} onChange={handleInputChange} placeholder="R$ 50.000" required />
                        <InputGroup label="Objetivo de Faturamento" name="goal" value={formData.goal} onChange={handleInputChange} placeholder="R$ 150.000" required />
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="Investimento em Ads/Mês" name="ads" value={formData.ads} onChange={handleInputChange} placeholder="R$ 2.000" required />
                        <InputGroup label="Principal Concorrente" name="competitor" value={formData.competitor} onChange={handleInputChange} placeholder="Quem lidera seu mercado?" />
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        <InputGroup 
                           label="Como você vende hoje? (Processo)" 
                           name="salesProcess" 
                           value={formData.salesProcess} 
                           onChange={handleInputChange} 
                           placeholder="Ex: Cliente chama no Whats, atendo manualmente..." 
                           required 
                        />
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-cbl-red font-bold uppercase tracking-wider">Qual sua maior dificuldade hoje?</label>
                          <textarea 
                            name="challenge"
                            value={formData.challenge}
                            onChange={handleInputChange}
                            placeholder="Ex: Tenho muitos curiosos e poucas vendas... / Não consigo escalar o atendimento... / Meu site não converte..."
                            className="bg-[#050505] border border-white/10 rounded p-3 text-white focus:border-cbl-red focus:outline-none transition-colors placeholder-gray-700 resize-none h-24 text-sm"
                            required
                          />
                        </div>
                     </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-cbl-red hover:bg-red-700 text-white font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(230,0,0,0.3)] hover:shadow-[0_0_40px_rgba(230,0,0,0.5)] flex items-center justify-center gap-2"
                >
                  Identificar Gargalos de Lucro <Search size={18} />
                </button>
              </form>
            )}

            {step === 'analyzing' && (
              <div className="flex flex-col items-center justify-center py-10 text-center h-full">
                <div className="relative w-32 h-32 mb-8">
                  {/* Outer Ring */}
                  <div className="absolute inset-0 border-t-2 border-cbl-red rounded-full animate-spin"></div>
                  {/* Inner Ring */}
                  <div className="absolute inset-4 border-r-2 border-white/20 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
                  
                  {/* Icon Transition */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={loadingIndex}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3 }}
                      >
                         {React.createElement(loadingTexts[loadingIndex].icon, { size: 32, className: "text-cbl-red" })}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Text Transition */}
                <div className="h-16 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.h3 
                      key={loadingIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-lg font-bold text-white tracking-wide"
                    >
                      {loadingTexts[loadingIndex].text}
                    </motion.h3>
                  </AnimatePresence>
                </div>
                
                <div className="w-full max-w-xs bg-gray-800 h-1 rounded-full mt-6 overflow-hidden">
                  <motion.div 
                    className="h-full bg-cbl-red"
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 12, ease: "linear" }} // Approx time for simulation
                  />
                </div>
              </div>
            )}

            {step === 'result' && (
              <div className="space-y-6">
                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                    <CheckCircle2 className="text-[#25D366] w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold text-white">Relatório Gerado</h2>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Protocolo: CBL-{Math.floor(Math.random() * 9999)}</p>
                    </div>
                 </div>
                 
                 <div className="bg-white/5 border border-white/10 p-6 rounded h-[500px] overflow-y-auto custom-scrollbar">
                    {/* Renderiza a resposta com Markdown Parser */}
                    <MarkdownRenderer content={analysis} />
                 </div>

                 <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row gap-4">
                    <a 
                      href={`https://wa.me/5513997744720?text=Vi o diagnóstico do meu negócio (${formData.name}) e preciso resolver o gargalo de: ${formData.challenge}. Podemos agendar uma reunião?`}
                      className="flex-1 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-center rounded transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2"
                    >
                      Avançar para Execução <ArrowRight size={18} />
                    </a>
                    <button 
                      onClick={() => setStep('form')}
                      className="px-6 py-4 border border-white/20 text-white hover:bg-white/10 transition-colors rounded"
                    >
                      Refazer
                    </button>
                 </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const InputGroup = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</label>
    <input 
      {...props}
      className="bg-[#050505] border border-white/10 rounded p-3 text-white focus:border-cbl-red focus:outline-none transition-colors placeholder-gray-700 text-sm"
    />
  </div>
);

export default ProjectAnalyzer;