
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
        const cleanKey = rawKey.replace(/[^a-zA-Z0-9\-_]/g, '').trim();
        const maskedKey = cleanKey.length > 8 ? `${cleanKey.substring(0, 5)}...${cleanKey.substring(cleanKey.length - 4)}` : "Inválida";

        if (!cleanKey) {
            setError({ message: 'Erro de Configuração.', technical: 'Chave não encontrada no Vercel.', keyDebug: maskedKey });
            setView('form');
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: cleanKey });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Gere um diagnóstico para a empresa ${formData.nome}. Desafio: ${formData.dificuldade}.`,
            });
            setAnalysisResult(response.text ?? '');
            setView('result');
        } catch (err: any) {
            const isInvalidKey = err?.message?.includes("400");
            setError({ 
                message: isInvalidKey ? 'Chave Recusada.' : 'Erro de Análise.', 
                keyDebug: maskedKey,
                technical: isInvalidKey ? 'O Google não aceitou esta chave de API.' : err.message 
            });
            setView('form');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
            <div className="bg-[#111] rounded-2xl w-full max-w-xl border border-white/10 p-8 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white"><XIcon /></button>
                
                {view === 'form' && (
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Raio-X <span className="text-red-600">Flash</span></h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Grupo CBL Intelligence</p>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nome da Empresa"
                                value={formData.nome}
                                onChange={e => setFormData({...formData, nome: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:border-red-600 outline-none transition-all"
                            />
                            <textarea
                                placeholder="Qual sua maior dificuldade?"
                                value={formData.dificuldade}
                                onChange={e => setFormData({...formData, dificuldade: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white h-32 focus:border-red-600 outline-none transition-all resize-none"
                            />
                        </div>
                        
                        {error && (
                            <div className="p-4 bg-red-600/5 border border-red-600/20 rounded text-center">
                                <p className="text-red-500 text-[10px] font-bold uppercase">{error.message}</p>
                                <p className="text-[9px] text-gray-500 mt-1 font-mono">DEBUG: {error.keyDebug}</p>
                            </div>
                        )}
                        <button type="submit" className="w-full bg-white text-black py-4 rounded font-black uppercase hover:bg-red-600 hover:text-white transition-all">Analisar Agora</button>
                    </form>
                )}
                
                {view === 'loading' && (
                    <div className="flex flex-col items-center py-12">
                        <SpinnerIcon />
                        <p className="mt-6 text-white text-xs font-bold animate-pulse uppercase tracking-widest">Processando Inteligência...</p>
                    </div>
                )}

                {view === 'result' && (
                    <div className="space-y-6">
                        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 text-sm text-gray-300 leading-relaxed font-light">
                            <div dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br/>') }} />
                        </div>
                        <button onClick={() => setView('form')} className="w-full bg-white/5 text-white py-3 rounded text-[10px] uppercase font-bold hover:bg-white/10 transition-all">Nova Análise</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiagnosticModal;
