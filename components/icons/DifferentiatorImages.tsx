
import React from 'react';

// Efeito de Scanline Global para as imagens HUD
const HUDOverlay = () => (
    <div className="absolute inset-0 pointer-events-none opacity-20" style={{ 
        backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 4px, 3px 100%'
    }}></div>
);

// Diferencial 1: Pensamento Fora da Caixa
export const DifferentiatorImage1: React.FC = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full relative group">
            <HUDOverlay />
            {/* Base Circular de Energia */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/5 rounded-full blur-3xl animate-pulse"></div>
            
            {/* Geometria de Hipercubo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                    {/* Linhas de Conexão */}
                    <g className="text-red-600/20">
                        <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 2" />
                    </g>
                    {/* Núcleo Ativo */}
                    <rect x="35" y="35" width="30" height="30" className="text-red-600 animate-[spin_10s_linear_infinite]" stroke="currentColor" strokeWidth="2" rx="4" />
                    <rect x="42" y="42" width="16" height="16" className="text-white/40 animate-[spin_5s_linear_infinite_reverse]" stroke="currentColor" strokeWidth="1" rx="2" />
                    
                    {/* Pontos de Dados */}
                    <circle cx="50" cy="10" r="1.5" fill="#ef4444" className="animate-ping" />
                    <circle cx="90" cy="30" r="1" fill="white" />
                    <circle cx="10" cy="70" r="1" fill="white" />
                </svg>
                
                {/* Texto de Telemetria */}
                <div className="absolute -top-4 left-0 font-mono text-[8px] text-red-500/60 tracking-widest animate-pulse">
                    ARCH_TYPE: CUSTOM_BUILD_V2
                </div>
            </div>
        </div>
    </div>
);

// Diferencial 2: Tecnologia + Estratégia
export const DifferentiatorImage2: React.FC = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full relative overflow-hidden">
            <HUDOverlay />
            {/* Grid de Dados */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* Fluxo Neural */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                <defs>
                    <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
                        <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
                        <stop offset="100%" stopColor="white" stopOpacity="1" />
                    </linearGradient>
                </defs>
                {/* Caminhos de Dados */}
                <path d="M20,100 L60,100 L80,60 L120,140 L140,100 L180,100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
                <path d="M20,100 L60,100 L80,60 L120,140 L140,100 L180,100" stroke="url(#flow-grad)" strokeWidth="2" fill="none" strokeDasharray="300" strokeDashoffset="300" className="animate-[stroke-draw_4s_linear_infinite]" />
                
                {/* Nós de Decisão */}
                <circle cx="80" cy="60" r="4" fill="#ef4444" className="animate-pulse shadow-lg shadow-red-500" />
                <circle cx="120" cy="140" r="4" fill="#ef4444" className="animate-pulse shadow-lg shadow-red-500" />
            </svg>

            {/* Painel Flutuante */}
            <div className="absolute bottom-10 right-10 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg flex flex-col gap-2">
                <div className="text-[7px] font-mono text-white/40 uppercase tracking-tighter">System_Optimization_Active</div>
                <div className="flex gap-1 h-4 items-end">
                    <div className="w-1 bg-red-600 animate-[h-pulse_1s_infinite]" style={{ height: '40%' }}></div>
                    <div className="w-1 bg-red-600 animate-[h-pulse_1.2s_infinite]" style={{ height: '80%' }}></div>
                    <div className="w-1 bg-red-600 animate-[h-pulse_0.8s_infinite]" style={{ height: '60%' }}></div>
                    <div className="w-1 bg-white animate-[h-pulse_1.5s_infinite]" style={{ height: '100%' }}></div>
                </div>
            </div>
        </div>
        <style>{`
            @keyframes stroke-draw {
                to { stroke-dashoffset: 0; }
            }
            @keyframes h-pulse {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
            }
        `}</style>
    </div>
);

// Diferencial 3: Foco no Resultado
export const DifferentiatorImage3: React.FC = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full relative flex items-center justify-center">
            <HUDOverlay />
            {/* Mira Radar */}
            <div className="relative w-64 h-64 lg:w-80 lg:h-80 border border-white/5 rounded-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(239,68,68,0.1)_90deg,transparent_90deg)] animate-[spin_3s_linear_infinite]"></div>
                
                {/* Elementos Crosshair */}
                <div className="absolute inset-4 border border-red-600/10 rounded-full"></div>
                <div className="absolute w-full h-[0.5px] bg-red-600/10"></div>
                <div className="absolute h-full w-[0.5px] bg-red-600/10"></div>
                
                {/* Alvo Travado */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-full flex items-center justify-center border-4 border-white/20 shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-pulse">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div className="mt-4 font-mono text-[9px] text-white bg-red-600 px-3 py-1 rounded tracking-[0.3em] uppercase">
                        Target_Locked: ROI+
                    </div>
                </div>

                {/* Dados Periféricos */}
                <div className="absolute top-10 left-10 font-mono text-[7px] text-red-500/40">
                    SCAN_01: SUCCESS<br/>
                    SCAN_02: SCALE_UP
                </div>
                <div className="absolute bottom-10 right-10 font-mono text-[7px] text-green-500/40">
                    CONVERSION: 98.4%<br/>
                    STATUS: OPTIMIZED
                </div>
            </div>
        </div>
    </div>
);
