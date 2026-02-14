
import { GoogleGenAI } from '@google/genai';
import React, { useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { XIcon } from './icons/XIcon';

const DiagnosticModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [view, setView] = useState('form');
    const [formData, setFormData] = useState({ nome: '', dificuldade: '' });
    const [analysisResult, setAnalysisResult] = useState('');
    const [error, setError] = useState<{ message: string; technical?: string; keyDebug?: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setView('loading');
        setError(null);

        const rawKey = process.env.API_KEY || "";
        const apiKey = rawKey.replace(/[^a-zA-Z0-9\-_]/g, '').trim();
        const maskedKey = apiKey.length > 8 ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}` : "Inválida";

        if (!apiKey || apiKey.toLowerCase().includes("placeholder")) {
            setError({ message: 'Erro de Configuração.', technical: 'Variável API_KEY não configurada no Vercel.', keyDebug: maskedKey });
            setView('form');
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-flash-latest',
                contents: `Gere um diagnóstico de negócios para a empresa ${formData.nome}. Desafio: ${formData.dificuldade}. Responda em Português do Brasil com tom profissional e estratégico.`,
            });
            setAnalysisResult(response.text ?? '');
            setView('result');
        } catch (err: any) {
            const isInvalidKey = err?.message?.includes("400");
            setError({ 
                message: isInvalidKey ? 'Chave Recusada.' : 'Erro de Análise.', 
                keyDebug: maskedKey,
                technical: isInvalidKey ? 'Verifique se a variável de ambiente foi atualizada no Vercel.' : err.message 
            });
            setView('form');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4" onClick={onClose}>
            <div className="bg-[#0a0a0a] rounded-3xl w-full max-w-xl border border-white/10 p-10 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><XIcon /></button>
                
                {view === 'form' && (
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Raio-X <span className="text-red-600">Flash</span></h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Grupo CBL Intelligence Unit</p>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nome da Empresa"
                                value={formData.nome}
                                onChange={e => setFormData({...formData, nome: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-red-600 outline-none transition-all placeholder:text-white/10"
                            />
                            <textarea
                                placeholder="Qual seu maior desafio tecnológico atual?"
                                value={formData.dificuldade}
                                onChange={e => setFormData({...formData, dificuldade: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white h-32 focus:border-red-600 outline-none transition-all resize-none placeholder:text-white/10"
                            />
                        </div>
                        
                        {error && (
                            <div className="p-4 bg-red-600/5 border border-red-600/20 rounded-xl text-center">
                                <p className="text-red-500 text-[10px] font-bold uppercase">{error.message}</p>
                                <p className="text-[9px] text-gray-500 mt-1 font-mono">DEBUG: {error.keyDebug}</p>
                            </div>
                        )}
                        <button type="submit" className="w-full bg-white text-black py-5 rounded-xl font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg">Solicitar Diagnóstico IA</button>
                    </form>
                )}
                
                {view === 'loading' && (
                    <div className="flex flex-col items-center py-20">
                        <SpinnerIcon />
                        <p className="mt-8 text-white text-[10px] font-bold animate-pulse uppercase tracking-[0.3em]">Analisando Ecossistema...</p>
                    </div>
                )}

                {view === 'result' && (
                    <div className="space-y-6">
                        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-4 text-sm text-gray-400 leading-relaxed font-light">
                            <div dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br/>') }} />
                        </div>
                        <button onClick={() => setView('form')} className="w-full bg-white/5 text-white py-4 rounded-xl text-[10px] uppercase font-bold hover:bg-white/10 transition-all border border-white/5">Nova Simulação</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiagnosticModal;
