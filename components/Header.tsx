
import React, { useState, useEffect } from 'react';
import { Logo } from './icons/Logo';

const NavLink: React.FC<{ href: string; children: React.ReactNode; onClick?: () => void }> = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium"
  >
    {children}
  </a>
);

const Header: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenModal();
  };
  
  const handleMobileContactClick = () => {
    closeMenu();
    onOpenModal();
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-sm border-b border-red-600/20' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <a href="#hero" className="text-xl font-bold tracking-wider">
            <Logo className="h-8 w-auto" />
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="#about">Quem Somos</NavLink>
            <NavLink href="#services">Expertise</NavLink>
            <NavLink href="#differentiators">Diferenciais</NavLink>
            <NavLink href="#contact">Contato</NavLink>
            <a href="#" onClick={handleContactClick} className="bg-white text-black px-5 py-2 rounded-md text-sm font-bold hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
              Iniciar Projeto
            </a>
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md">
          <nav className="flex flex-col items-center space-y-4 px-6 py-8">
            <NavLink href="#about" onClick={closeMenu}>Quem Somos</NavLink>
            <NavLink href="#services" onClick={closeMenu}>Expertise</NavLink>
            <NavLink href="#differentiators" onClick={closeMenu}>Diferenciais</NavLink>
            <NavLink href="#contact" onClick={closeMenu}>Contato</NavLink>
            <a href="#" onClick={handleMobileContactClick} className="bg-white text-black px-6 py-3 rounded-md text-sm font-bold hover:bg-gray-200 transition-colors duration-300 w-full text-center cursor-pointer">
              Iniciar Projeto
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
