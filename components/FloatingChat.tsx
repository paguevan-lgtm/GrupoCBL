import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const FloatingChat: React.FC = () => {
  return (
    <motion.a
      href="https://wa.me/5513997744720?text=Olá, vim pelo site do Grupo CBL e gostaria de mais informações."
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <MessageCircle size={28} fill="white" className="text-[#25D366]" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white text-cbl-black px-3 py-1.5 rounded shadow-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Fale Conosco
      </span>
      
      {/* Ripple Effect */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-ping -z-10"></span>
    </motion.a>
  );
};

export default FloatingChat;