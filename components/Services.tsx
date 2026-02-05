import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Cpu, Globe, Settings, Smartphone, TrendingUp } from 'lucide-react';
import type { ServiceItem } from '../types';

const services: ServiceItem[] = [
  { id: 1, title: 'Desenvolvimento Web', description: 'Sites institucionais de alto impacto, landing pages que convertem e portais corporativos robustos.', icon: Monitor },
  { id: 2, title: 'Sistemas Sob Medida', description: 'Softwares desenhados especificamente para a regra de negócio da sua empresa. Nada de adaptações forçadas.', icon: Cpu },
  { id: 3, title: 'Plataformas SaaS', description: 'Transformamos sua ideia de startup em um produto digital escalável, seguro e pronto para o mercado.', icon: Globe },
  { id: 4, title: 'Automação de Processos', description: 'Eliminamos trabalho manual repetitivo integrando sistemas e criando bots inteligentes.', icon: Settings },
  { id: 5, title: 'Soluções Mobile', description: 'APIs e interfaces responsivas que garantem que seu negócio esteja na palma da mão do cliente.', icon: Smartphone },
  { id: 6, title: 'Consultoria Tech', description: 'Análise de dados e tecnologia aplicada para descobrir onde seu negócio está deixando dinheiro na mesa.', icon: TrendingUp },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-cbl-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cbl-red font-bold tracking-widest uppercase mb-4 text-sm"
          >
            Nossa Expertise
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl text-white"
          >
            Engenharia de Oportunidades
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative bg-[#0a0a0a] border border-white/5 p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-cbl-red/30 rounded-sm"
            >
              {/* Background Glow Effect */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-cbl-red/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cbl-red/10 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-900/5 rounded-full blur-[40px] translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-white/5 flex items-center justify-center rounded mb-6 text-white group-hover:bg-cbl-red group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-cbl-red/20">
                  <service.icon size={28} strokeWidth={1.5} />
                </div>
                
                <h4 className="font-display font-bold text-2xl text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {service.title}
                </h4>
                
                <p className="text-gray-400 font-light leading-relaxed text-sm flex-grow">
                  {service.description}
                </p>
                
                {/* Visual indicator replacement for 'Details' */}
                <div className="h-0.5 w-12 bg-white/10 mt-6 group-hover:w-full group-hover:bg-cbl-red transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
