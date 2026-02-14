
import React, { useState } from 'react';
import { FadeInOnScroll } from './FadeInOnScroll';
import { DifferentiatorImage1, DifferentiatorImage2, DifferentiatorImage3 } from './icons/DifferentiatorImages';

interface Differentiator {
    number: string;
    title: string;
    description: string;
    image: React.ReactNode;
}

const differentiatorsData: Differentiator[] = [
    {
        number: '1',
        title: 'Pensamento Fora da Caixa',
        description: 'Não usamos templates prontos para resolver problemas complexos. Se a solução não existe, nós a construímos do zero, com uma arquitetura pensada para o seu desafio específico.',
        image: <DifferentiatorImage1 />
    },
    {
        number: '2',
        title: 'Tecnologia + Estratégia',
        description: 'Código limpo é importante, mas código que gera lucro é essencial. Unimos desenvolvimento técnico de ponta com uma visão comercial afiada para garantir que cada linha de código contribua para o seu ROI.',
        image: <DifferentiatorImage2 />
    },
    {
        number: '3',
        title: 'Foco no Resultado',
        description: 'Design bonito é obrigação. Nosso foco está nas métricas, na conversão e na eficiência operacional que entregamos. O sucesso do seu projeto é medido por resultados tangíveis.',
        image: <DifferentiatorImage3 />
    },
];


const DifferentiatorsSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [contentPhase, setContentPhase] = useState('entered');
    const [content, setContent] = useState(differentiatorsData[0]);

    const handleSelect = (index: number) => {
        if (index === activeIndex) return;
        setContentPhase('entering');
        setTimeout(() => {
            setActiveIndex(index);
            setContent(differentiatorsData[index]);
            setContentPhase('entered');
        }, 400); // Tempo aumentado para transição mais dramática
    };

    return (
        <section id="differentiators" className="py-24 md:py-48 bg-[#0a0a0a] overflow-hidden relative">
            {/* Decoração de Fundo Profundo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[radial-gradient(circle,rgba(229,62,62,0.02)_0%,transparent_60%)] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <FadeInOnScroll className="text-center mb-24 md:mb-40">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
                        Por que somos <span className="text-red-600 drop-shadow-[0_0_15px_rgba(229,62,62,0.3)]">diferentes?</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mt-8 font-light leading-relaxed">
                        O mercado está saturado de soluções genéricas. No <span className="text-white font-medium">Grupo CBL</span>, nós criamos o caminho onde a inovação se torna vantagem competitiva real.
                    </p>
                </FadeInOnScroll>

                <div className="grid lg:grid-cols-2 gap-16 lg:gap-40 items-center">
                    {/* Coluna Esquerda: Itens Clicáveis */}
                    <div className="space-y-6 md:space-y-8">
                       {differentiatorsData.map((item, index) => (
                           <FadeInOnScroll key={item.number} style={{ transitionDelay: `${index * 150}ms`}}>
                                <div
                                    onClick={() => handleSelect(index)}
                                    className={`p-8 md:p-12 rounded-3xl border-2 cursor-pointer transition-all duration-700 group relative overflow-hidden ${activeIndex === index ? 'border-red-600 bg-red-600/[0.03] shadow-[0_0_50px_rgba(229,62,62,0.1)] scale-[1.02]' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}
                                >
                                    {/* Indicador de progresso no item ativo */}
                                    {activeIndex === index && (
                                        <div className="absolute bottom-0 left-0 h-[3px] bg-red-600 animate-[progress_5s_linear_infinite]" style={{ width: '100%' }}></div>
                                    )}
                                    
                                    <div className="flex items-center space-x-8">
                                        <div className={`flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all duration-700 font-black text-lg ${activeIndex === index ? 'border-red-600 bg-red-600 text-white shadow-[0_0_25px_rgba(229,62,62,0.5)]' : 'border-white/10 text-gray-600 group-hover:border-white/30'}`}>
                                            {item.number}
                                        </div>
                                        <h3 className={`text-2xl md:text-4xl font-bold transition-all duration-700 tracking-tighter ${activeIndex === index ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{item.title}</h3>
                                    </div>
                                </div>
                           </FadeInOnScroll>
                       ))}
                    </div>

                    {/* Coluna Direita: Conteúdo Dinâmico / Visualizador HUD */}
                    <div className="relative h-[500px] lg:h-[700px] flex flex-col justify-center">
                         <div className={`differentiator-content ${contentPhase} absolute inset-0 flex flex-col justify-center items-center lg:items-start transition-all duration-500`}>
                            {/* Área da Imagem HUD */}
                            <div className="relative h-80 lg:h-[450px] w-full mb-16 flex items-center justify-center bg-black/40 rounded-[3rem] border border-white/5 shadow-inner">
                                {content.image}
                            </div>
                            
                            {/* Texto Descritivo */}
                            <div className="max-w-xl w-full px-6 lg:px-0">
                                <div className="h-[2px] w-16 bg-red-600 mb-8 hidden lg:block shadow-[0_0_10px_#ef4444]"></div>
                                <p className="text-gray-300 leading-relaxed text-center lg:text-left text-xl md:text-2xl font-light italic">
                                    "{content.description}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                .differentiator-content.entering {
                    opacity: 0;
                    transform: scale(0.95) translateY(20px);
                    filter: blur(10px);
                }
                .differentiator-content.entered {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                    filter: blur(0);
                }
            `}</style>
        </section>
    );
};

export default DifferentiatorsSection;
