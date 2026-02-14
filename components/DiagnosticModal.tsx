
import { GoogleGenAI } from '@google/genai';
import React, { useCallback, useEffect, useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { XIcon } from './icons/XIcon';

// FIX: Added interface for FormFieldProps and made placeholder optional to resolve TS errors where it was not provided in component calls.
interface FormFieldProps {
    label: string;
    placeholder?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isChecked: boolean;
    type?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, placeholder = '', name, value, onChange, isChecked, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={isChecked}
            className="w-full bg-[#3d4451] border border-transparent rounded-md px-3 py-2 text-white focus:outline-none transition-shadow duration-300 disabled:opacity-50"
        />
    </div>
);

const DiagnosticModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [view, setView] = useState('form');
    const [formData, setFormData] = useState<any>({ nome: '', link: '', faturamento: '', dificuldade: '' });
    const [analysisResult, setAnalysisResult] = useState('');
    const [error, setError] = useState<{ message: string; technical?: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setView('loading');
        setError(null);

        const apiKey = process.env.API_KEY;
        
        if (!apiKey || apiKey === "undefined") {
          setError({ message: 'Conexão com API Indisponível.', technical: 'Variável API_KEY não configurada no ambiente.' });
          setView('form');
          return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Gere um diagnóstico de negócios estratégico para a empresa ${formData.nome}. Dificuldade relatada: ${formData.dificuldade}. Foque em soluções tecnológicas do Grupo CBL.`,
            });
            setAnalysisResult(response.text ?? '');
            setView('result');
        } catch (err: any) {
            console.error("Diagnostic API Error:", err);
            setError({ message: 'Falha na análise estratégica.', technical: err?.message || 'Erro de rede ou cota.' });
            setView('form');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
            <div className="bg-[#1A1A1A] rounded-lg w-full max-w-2xl mx-4 border border-gray-700 p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400"><XIcon /></button>
                
                {view === 'form' && (
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-white italic uppercase">Raio-X de Negócios</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormField label="Nome" name="nome" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} isChecked={false} />
                           <FormField label="Faturamento" name="faturamento" value={formData.faturamento} onChange={e => setFormData({...formData, faturamento: e.target.value})} isChecked={false} />
                        </div>
                        <FormField label="Principal Dificuldade" name="dificuldade" value={formData.dificuldade} onChange={e => setFormData({...formData, dificuldade: e.target.value})} isChecked={false} />
                        
                        {error && (
                            <div className="p-3 bg-red-600/10 border border-red-600/30 rounded text-center">
                                <p className="text-red-500 text-xs font-bold uppercase tracking-wider">{error.message}</p>
                                <p className="text-[10px] text-gray-500 mt-1 italic font-mono">{error.technical}</p>
                            </div>
                        )}
                        <button type="submit" className="w-full bg-red-600 text-white py-3 rounded font-bold uppercase italic hover:bg-red-700">Iniciar Diagnóstico</button>
                    </form>
                )}
                
                {view === 'loading' && (
                    <div className="flex flex-col items-center py-12">
                        <SpinnerIcon />
                        <p className="mt-4 text-white animate-pulse">Sincronizando com Engenharia CBL...</p>
                    </div>
                )}

                {view === 'result' && (
                    <div className="max-h-[70vh] overflow-y-auto custom-scrollbar text-gray-200">
                        <div dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br/>') }} />
                        <button onClick={() => setView('form')} className="mt-6 w-full bg-white/10 text-white py-2 rounded text-xs">Nova Análise</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiagnosticModal;
