
import { GoogleGenAI } from '@google/genai';
import React, { useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { XIcon } from './icons/XIcon';

const DiagnosticModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [view, setView] = useState('form');
    const [formData, setFormData] = useState({ nome: '', dificuldade: '' });
    const [analysisResult, setAnalysisResult] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setView('loading');
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Gere um diagnóstico estratégico rápido para a empresa ${formData.nome}. Desafio: ${formData.dificuldade}.`,
            });
            setAnalysisResult(response.text ?? 'Nenhum resultado gerado.');
            setView('result');
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erro na conexão com o servidor de IA.");
            setView('form');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4" onClick={onClose}>
            <div className="bg-[#0a0a0a] rounded-3xl w-full max-w-lg border border-white/10 p-10 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><XIcon /></button>
                
                {view === 'form' && (
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Raio-X <span className="text-red-600">IA</span></h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1">CBL Strategy Unit</p>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Empresa"
                                value={formData.nome}
                                onChange={e => setFormData({...formData, nome: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-red-600 outline-none transition-all"
                            />
                            <textarea
                                placeholder="Qual seu maior desafio tecnológico?"
                                value={formData.dificuldade}
                                onChange={e => setFormData({...formData, dificuldade: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white h-32 focus:border-red-600 outline-none transition-all resize-none"
                            />
                        </div>
                        
                        {error && (
                            <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-xl">
                                <p className="text-red-500 text-[10px] font-mono break-all">{error}</p>
                            </div>
                        )}
                        <button type="submit" className="w-full bg-white text-black py-5 rounded-xl font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-red-600/10">Iniciar Diagnóstico</button>
                    </form>
                )}
                
                {view === 'loading' && (
                    <div className="flex flex-col items-center py-20 text-center">
                        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-8 text-white text-[10px] font-bold animate-pulse uppercase tracking-[0.5em]">Processando...</p>
                    </div>
                )}

                {view === 'result' && (
                    <div className="space-y-8">
                        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-4 text-sm text-gray-300 leading-relaxed font-light">
                            <div dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br/>') }} />
                        </div>
                        <button onClick={() => setView('form')} className="w-full bg-red-600 text-white py-4 rounded-xl text-[10px] uppercase font-black tracking-widest hover:bg-red-700 transition-all">Nova Consulta</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiagnosticModal;
