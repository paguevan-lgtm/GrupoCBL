
import React from 'react';
import { FadeInOnScroll } from './FadeInOnScroll';

interface DifferentiatorProps {
    number: string;
    title: string;
    description: string;
}

const DifferentiatorItem: React.FC<DifferentiatorProps> = ({ number, title, description }) => (
    <div className="flex items-start space-x-6 py-6 border-b border-white/10">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-gray-300 font-bold">
            {number}
        </div>
        <div>
            <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    </div>
);


const DifferentiatorsSection: React.FC = () => {
    const differentiators = [
        {
            number: '1',
            title: 'Pensamento Fora da Caixa',
            description: 'Não usamos templates prontos para resolver problemas complexos. Se a solução não existe, nós a construímos.'
        },
        {
            number: '2',
            title: 'Tecnologia + Estratégia',
            description: 'Código limpo é importante, mas código que gera lucro é essencial. Unimos desenvolvimento técnico com visão comercial.'
        },
        {
            number: '3',
            title: 'Foco no Resultado',
            description: 'Design bonito é obrigação. Nosso foco está nas métricas, na conversão e na eficiência operacional que entregamos.'
        },
    ];

    return (
        <section id="differentiators" className="py-20 md:py-32 bg-[#111]">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <FadeInOnScroll className="lg:pr-12">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
                            Por que somos <span className="text-red-600">diferentes?</span>
                        </h2>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            O mercado está cheio de "mais do mesmo". Nós escolhemos o caminho da inovação prática.
                        </p>
                    </FadeInOnScroll>
                    <div className="space-y-4">
                       {differentiators.map((item, index) => (
                           <FadeInOnScroll key={index} style={{ transitionDelay: `${index * 150}ms`}}>
                                <DifferentiatorItem {...item} />
                           </FadeInOnScroll>
                       ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DifferentiatorsSection;
