
import React, { useRef, useEffect, useMemo, useState } from 'react';

// --- Helper Functions and Components for the 3D Globe ---

// Function to generate points on a sphere using Fibonacci lattice
const generateGlobePoints = (samples: number) => {
  const points = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians

  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
    const radius = Math.sqrt(1 - y * y); // radius at y
    const theta = phi * i; // golden angle increment
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    const lat = Math.asin(y) * 180 / Math.PI;
    const lon = Math.atan2(z, x) * 180 / Math.PI;
    points.push({ lat, lon });
  }
  return points;
};

const GlobePoint: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
  const containerStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: `rotateY(${lon}deg) rotateX(${-lat}deg) translateZ(var(--globe-radius))`,
  };

  const dotStyle = {
    animationDelay: `${Math.random() * 6}s`,
  };

  return (
    <div style={containerStyle}>
      <div className="globe-dot" style={dotStyle}></div>
    </div>
  );
};

const ConnectionLine: React.FC<{ rotationX: number; rotationY: number; rotationZ: number; }> = ({ rotationX, rotationY, rotationZ }) => {
  const containerStyle = {
    transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg)`,
  };
  return (
    <div className="connection-line-container" style={containerStyle}>
        <div className="connection-line"></div>
    </div>
  );
};

interface HeroSectionProps {
  onOpenModal: () => void;
  startAnimation: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal, startAnimation }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rotatingContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();
  const currentRotation = useRef(0);
  
  // Animation state refs
  const initialGlobeScale = useRef(1.6); // Increased initial zoom
  const initialRotationX = useRef(-20); // Initial tilt
  const initialRotationY = useRef(30);  // Initial side rotation
  
  const [animateText, setAnimateText] = useState(false);

  useEffect(() => {
    if (startAnimation) {
      const timer = setTimeout(() => setAnimateText(true), 100);
      return () => clearTimeout(timer);
    }
  }, [startAnimation]);

  const globePoints = useMemo(() => generateGlobePoints(150), []);
  const connectionLines = useMemo(() => {
      return Array.from({ length: 30 }).map(() => ({
          rotationX: Math.random() * 360,
          rotationY: Math.random() * 360,
          rotationZ: Math.random() * 360,
      }));
  }, []);


  useEffect(() => {
    const animate = () => {
      if (!wrapperRef.current || !rotatingContainerRef.current) return;

      const scrollY = window.scrollY;
      const heroHeight = document.getElementById('hero')?.offsetHeight || window.innerHeight;
      
      currentRotation.current += 0.03;

      let scrollRotation = 0;
      if (scrollY <= heroHeight) {
        scrollRotation = (scrollY / heroHeight) * 45;
      }
      const totalYRotation = currentRotation.current + scrollRotation;
     
      if (startAnimation) {
        // --- Settle Effect Animation ---
        // Animate initial scale from 1.6 down to 1
        initialGlobeScale.current += (1 - initialGlobeScale.current) * 0.04;
        // Animate initial rotation back to 0
        initialRotationX.current += (0 - initialRotationX.current) * 0.04;
        initialRotationY.current += (0 - initialRotationY.current) * 0.04;
      } else {
        // Reset if intro is not finished
        initialGlobeScale.current = 1.6;
        initialRotationX.current = -20;
        initialRotationY.current = 30;
      }

      // Apply combined rotations
      rotatingContainerRef.current.style.transform = `rotateY(${totalYRotation + initialRotationY.current}deg) rotateX(${10 + initialRotationX.current}deg)`;

      // --- Zoom on scroll ---
      const scrollPercentZoom = Math.min(1, scrollY / (heroHeight * 0.8));
      const scrollScale = 1 + scrollPercentZoom * 0.4;
      
      // Combine initial zoom-out with scroll-based zoom
      wrapperRef.current.style.transform = `scale(${initialGlobeScale.current * scrollScale})`;

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [startAnimation]);


  const handleOpenModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenModal();
  };

  return (
    <section 
        id="hero" 
        className="h-[100svh] min-h-[700px] lg:min-h-screen relative overflow-hidden" 
    >
      <div className="tech-globe-container">
        <div className="globe-wrapper" ref={wrapperRef}>
            <div className="globe-background"></div>
            <div className="rotating-elements" ref={rotatingContainerRef}>
                {globePoints.map((point, index) => (
                    <GlobePoint key={`dot-${index}`} lat={point.lat} lon={point.lon} />
                ))}
                {connectionLines.map((line, index) => (
                    <ConnectionLine key={`line-${index}`} {...line} />
                ))}
            </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#1A1A1A] z-0"></div>
      
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-6">
          <div className="w-full">
             <div 
              className={`mb-6 transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              style={{ transitionDelay: '100ms' }}
            >
              <span className="inline-block bg-gray-800/50 text-white border border-white/20 rounded-full px-3 py-1 text-xs sm:px-4 sm:text-sm font-semibold tracking-wider">
                <span className="text-red-500">•</span> GRUPO CBL • HIGH-END DIGITAL SOLUTIONS
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase">
              <div className="overflow-hidden py-1"><span className={`block transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{ transitionDelay: '200ms' }}>Oportunidade</span></div>
              <div className="overflow-hidden py-1"><span className={`block bg-gradient-to-r from-gray-500 to-white text-transparent bg-clip-text transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{ transitionDelay: '350ms' }}>Não se espera.</span></div>
              <div className="overflow-hidden py-1"><span className={`text-red-600 block transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} style={{ transitionDelay: '500ms' }}>Se cria.</span></div>
            </h1>

            <p 
              className={`text-lg md:text-xl text-gray-300 max-w-2xl mx-auto my-6 md:my-8 transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '700ms' }}
            >
              Especialistas em transformar ideias complexas em ecossistemas digitais de alta performance. Estratégia, desenvolvimento e lucro em um só lugar.
            </p>
            <div 
              className={`flex flex-wrap justify-center items-center gap-4 transition-all duration-700 ease-out ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '800ms' }}
            >
              <a href="#" onClick={handleOpenModal} className="bg-red-600 text-white px-8 py-3 rounded-md font-bold hover:bg-red-700 transition-transform duration-300 hover:scale-105 flex items-center gap-2">
                INICIAR PROJETO 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </a>
              <a href="#services" className="border border-white/50 text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-black transition-all duration-300">
                Conhecer Expertise
              </a>
            </div>
          </div>
      </div>
      
      <div 
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white/50 text-xs tracking-widest uppercase z-10 transition-opacity duration-700 ease-out ${animateText ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: '1000ms' }}
      >
        Explore
        <svg className="w-4 h-4 mx-auto mt-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </section>
  );
};

export default HeroSection;
