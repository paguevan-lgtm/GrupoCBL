import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin, Zap } from 'lucide-react';

interface ContactCTAProps {
  onOpenAnalyzer: () => void;
}

const ContactCTA: React.FC<ContactCTAProps> = ({ onOpenAnalyzer }) => {
  return (
    <section id="contact" className="py-32 bg-cbl-black relative overflow-hidden flex items-center justify-center border-t border-white/5">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-cbl-black via-cbl-red/5 to-cbl-black pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cbl-red/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block text-cbl-red font-bold tracking-widest uppercase mb-4 text-sm"
        >
          Vamos Conversar?
        </motion.span>

        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-4xl md:text-6xl text-white mb-8 leading-tight"
        >
          Se você tem uma ideia, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">nós damos forma.</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light"
        >
          Oportunidades não esperam. Transforme seu negócio hoje com a estratégia e tecnologia do Grupo CBL.
        </motion.p>
        
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.3 }}
           className="flex items-center justify-center gap-2 text-gray-500 mb-12"
        >
           <MapPin size={16} className="text-cbl-red" />
           <span className="text-xs font-bold tracking-widest uppercase">Base em São Paulo • Atuação Nacional</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <button 
            onClick={onOpenAnalyzer}
            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-cbl-black font-display font-bold text-xl tracking-wide overflow-hidden rounded-sm hover:bg-cbl-red hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(230,0,0,0.4)] cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2"><Zap size={20} /> INICIAR PROJETO</span>
            <ArrowUpRight className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </motion.div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-gray-600 text-xs tracking-wide">
            Atendimento direto: (13) 99774-4720
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;