import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

interface HeaderProps {
  onOpenAnalyzer: () => void;
}

const navItems = [
  { label: 'Quem Somos', href: '#about' },
  { label: 'Expertise', href: '#services' },
  { label: 'Diferenciais', href: '#features' },
  { label: 'Contato', href: '#contact' },
];

const Header: React.FC<HeaderProps> = ({ onOpenAnalyzer }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled 
          ? 'bg-cbl-black/95 backdrop-blur-xl border-white/5 py-4 shadow-2xl' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-cbl-red origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <a href="/" className="flex items-center gap-3 group z-50">
          <div className="w-12 h-12 relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
             <img 
               src={`${import.meta.env.BASE_URL}favicon.ico`} 
               alt="Grupo CBL Logo" 
               className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(230,0,0,0.3)]"
             />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-display font-bold text-2xl tracking-tighter text-white leading-none group-hover:text-gray-200 transition-colors">
              GRUPO CBL
            </span>
            <span className="text-[9px] font-bold text-cbl-red tracking-[0.3em] uppercase mt-1 opacity-90">
              Inovação & Tech
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a 
              key={item.label} 
              href={item.href}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors tracking-wide relative group py-2"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cbl-red transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          {/* Action Button */}
          <button 
            onClick={onOpenAnalyzer}
            className="px-6 py-2.5 bg-white text-cbl-black font-bold text-sm hover:bg-cbl-red hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-white/5 hover:shadow-cbl-red/20 rounded-sm cursor-pointer"
          >
            Iniciar Projeto
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50 p-2 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-cbl-black md:hidden overflow-y-auto"
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
              
              <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
                <nav className="flex flex-col items-center gap-8 w-full">
                  {navItems.map((item) => (
                    <a 
                      key={item.label} 
                      href={item.href}
                      onClick={handleLinkClick}
                      className="text-3xl font-display font-bold text-white/50 hover:text-white hover:scale-110 transition-all duration-300 text-center"
                    >
                      {item.label}
                    </a>
                  ))}
                  <button 
                     onClick={() => { handleLinkClick(); onOpenAnalyzer(); }}
                     className="mt-8 w-full max-w-xs px-10 py-4 bg-cbl-red text-white font-bold text-xl rounded shadow-[0_0_30px_rgba(230,0,0,0.4)]"
                  >
                    Análise Gratuita
                  </button>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
