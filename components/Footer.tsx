import React from 'react';
import { Instagram, MapPin, Phone, MessageCircle, Mail } from 'lucide-react';

interface FooterProps {
  onOpenAnalyzer?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenAnalyzer }) => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cbl-red to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <path d="M50 10 L80 60 H20 L50 10Z" fill="#e60000" />
                  <path d="M22 65 L15 82 H35 L39 65 H22Z" fill="white" />
                  <path d="M61 65 L65 82 H85 L81 65 H61Z" fill="white" />
                </svg>
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl text-white tracking-tight leading-none">GRUPO CBL</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Digital & Strategy</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-7 font-light pr-4">
              Focados em tecnologia e resultados. O Grupo CBL transforma desafios complexos em soluções digitais simples e lucrativas. Atuamos onde existe oportunidade de inovação.
            </p>
            <div className="flex gap-4">
              <SocialButton href="https://instagram.com/Grupo.cbl" icon={<Instagram size={18} />} label="Instagram" />
              <SocialButton href="https://wa.me/5513997744720" icon={<MessageCircle size={18} />} label="WhatsApp" />
              <SocialButton href="mailto:contato@grupocbl.com.br" icon={<Mail size={18} />} label="Email" />
            </div>
          </div>

          {/* Links Column (3 cols) */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Menu</h4>
            <ul className="space-y-4">
              {['Quem Somos', 'Serviços', 'Diferenciais', 'Contato'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(' ', '')}`}
                    className="text-gray-500 hover:text-cbl-red transition-colors text-sm flex items-center gap-2"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Contato</h4>
            <ul className="space-y-6">
              <ContactItem 
                icon={<Phone size={18} />} 
                title="Comercial" 
                value="(13) 99774-4720" 
                href="https://wa.me/5513997744720"
              />
              <ContactItem 
                icon={<MapPin size={18} />} 
                title="Sede" 
                value="São Paulo, SP" 
                sub="Atendimento Global"
              />
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Grupo CBL Soluções Digitais. Todos os direitos reservados.
          </p>
          <div className="flex gap-8 text-xs text-gray-600 font-medium">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialButton = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a 
    href={href} 
    aria-label={label}
    className="w-10 h-10 bg-white/5 rounded flex items-center justify-center text-gray-400 hover:bg-white hover:text-cbl-black transition-all duration-300"
  >
    {icon}
  </a>
);

const ContactItem = ({ icon, title, value, href, sub }: { icon: React.ReactNode; title: string; value: string; href?: string; sub?: string }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 text-cbl-red">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{title}</p>
      {href ? (
        <a href={href} className="text-white hover:text-cbl-red transition-colors font-medium block">
          {value}
        </a>
      ) : (
        <p className="text-white font-medium">{value}</p>
      )}
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  </div>
);

export default Footer;
