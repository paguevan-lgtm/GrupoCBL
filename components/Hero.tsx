import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Zap } from 'lucide-react';

interface HeroProps {
  onOpenAnalyzer: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAnalyzer }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cbl-black pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Changed background to abstract digital/tech vibe */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-b from-cbl-black via-transparent to-cbl-black" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Animated Glow Sphere */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cbl-red blur-[180px] rounded-full opacity-10" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 py-1.5 px-5 border border-white/10 rounded-full bg-white/5 text-gray-300 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cbl-red animate-pulse"></span>
            Grupo CBL • High-End Digital Solutions
          </span>
        </motion.div>

        <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-9xl tracking-tighter text-white mb-8 leading-[0.9]">
          <motion.span 
            className="block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            OPORTUNIDADE
          </motion.span>
          <motion.span 
            className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            NÃO SE ESPERA.
          </motion.span>
          <motion.span 
            className="block text-cbl-red relative z-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            SE CRIA.
          </motion.span>
        </h1>

        <motion.p 
          className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-12 leading-relaxed font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Especialistas em transformar ideias complexas em ecossistemas digitais de alta performance. Estratégia, desenvolvimento e lucro em um só lugar.
        </motion.p>

        <motion.div 
          className="flex flex-col md:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {/* Trigger Analyzer */}
          <button 
            onClick={onOpenAnalyzer}
            className="group relative px-8 py-4 bg-cbl-red text-white font-bold tracking-wide overflow-hidden w-full md:w-auto text-center rounded-sm hover:shadow-[0_0_30px_rgba(230,0,0,0.4)] transition-shadow duration-300 cursor-pointer"
          >
            <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            <span className="relative flex items-center justify-center gap-2 group-hover:text-cbl-red transition-colors">
              INICIAR PROJETO <Zap size={18} />
            </span>
          </button>
          
          <a 
            href="#services" 
            className="group px-8 py-4 border border-white/20 text-white font-medium hover:bg-white/10 transition-all duration-300 w-full md:w-auto text-center rounded-sm backdrop-blur-sm"
          >
            Conhecer Expertise
          </a>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] uppercase tracking-widest">Explore</span>
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
};

export default Hero;