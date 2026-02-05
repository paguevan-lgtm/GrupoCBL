import React from 'react';
import { motion } from 'framer-motion';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-cbl-dark border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="lg:w-1/3">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6 sticky top-24">
              Por que somos <span className="text-cbl-red">diferentes?</span>
            </h2>
            <p className="text-gray-400 mt-4 text-lg">
              O mercado está cheio de "mais do mesmo". Nós escolhemos o caminho da inovação prática.
            </p>
          </div>

          <div className="lg:w-2/3 grid gap-8">
            {[
              {
                title: "Pensamento Fora da Caixa",
                text: "Não usamos templates prontos para resolver problemas complexos. Se a solução não existe, nós a construímos."
              },
              {
                title: "Tecnologia + Estratégia",
                text: "Código limpo é importante, mas código que gera lucro é essencial. Unimos desenvolvimento técnico com visão comercial."
              },
              {
                title: "Foco no Resultado",
                text: "Design bonito é obrigação. Nosso foco está nas métricas, na conversão e na eficiência operacional que entregamos."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex gap-6 group"
              >
                <div className="flex-shrink-0 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center font-display font-bold text-xl text-white group-hover:border-cbl-red group-hover:bg-cbl-red transition-all">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">{feature.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;