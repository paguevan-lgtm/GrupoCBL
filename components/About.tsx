import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Layers } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-cbl-dark relative overflow-hidden">
      {/* Decorative text */}
      <div className="absolute top-0 right-0 text-[20rem] font-display font-bold text-white/[0.02] leading-none select-none pointer-events-none -translate-y-1/2 translate-x-1/4">
        CBL
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-cbl-red font-bold tracking-widest uppercase mb-4 text-sm">Quem Somos</h2>
          <h3 className="font-display font-bold text-4xl md:text-5xl text-white mb-8 leading-tight">
            Não somos apenas uma agência.<br />
            <span className="text-gray-500">Somos um motor de negócios.</span>
          </h3>
          
          <div className="space-y-6 text-gray-300 font-light leading-relaxed text-lg">
            <p>
              O <strong className="text-white font-semibold">Grupo CBL</strong> é uma holding multifuncional focada em inovação e alta performance. Atuamos onde a tecnologia pode gerar alavancagem de resultados.
            </p>
            <p>
              Não nos limitamos ao básico. Nosso core é o desenvolvimento de soluções digitais sob medida, inteligência de dados e automação de processos. Entregamos o que o mercado exige: velocidade e eficiência.
            </p>
            <p className="border-l-4 border-cbl-red pl-6 italic text-white/90">
              "Não vendemos apenas código. Entregamos autoridade, escalabilidade e novos canais de receita para sua empresa."
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6">
          {[
            { 
              icon: Target, 
              title: "Visão Estratégica", 
              desc: "Identificamos lacunas no mercado e criamos a ponte tecnológica para preenchê-las com lucro." 
            },
            { 
              icon: Zap, 
              title: "Alta Performance", 
              desc: "Sistemas rápidos, interfaces fluidas e infraestrutura robusta para suportar o crescimento do seu negócio." 
            },
            { 
              icon: Layers, 
              title: "Soluções 360º", 
              desc: "Do design da interface à arquitetura de banco de dados. Resolvemos o problema de ponta a ponta." 
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-cbl-gray/50 backdrop-blur-sm p-6 border border-white/5 hover:border-cbl-red/50 transition-all duration-300 group rounded-sm"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-black rounded text-cbl-red group-hover:scale-110 transition-transform shadow-lg shadow-cbl-red/5">
                  <item.icon size={24} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xl text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;