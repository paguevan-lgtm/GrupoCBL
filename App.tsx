import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Features from './components/Features';
import ContactCTA from './components/ContactCTA';
import Footer from './components/Footer';
import ProjectAnalyzer from './components/ProjectAnalyzer';

const App: React.FC = () => {
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);

  const openAnalyzer = () => setIsAnalyzerOpen(true);

  return (
    <div className="bg-cbl-black min-h-screen text-white selection:bg-cbl-red selection:text-white overflow-x-hidden">
      <Header onOpenAnalyzer={openAnalyzer} />
      
      <main className="relative z-10 bg-cbl-black">
        <Hero onOpenAnalyzer={openAnalyzer} />
        <About />
        <Services />
        <Features />
        <ContactCTA onOpenAnalyzer={openAnalyzer} />
      </main>

      <Footer onOpenAnalyzer={openAnalyzer} />
      
      <ProjectAnalyzer 
        isOpen={isAnalyzerOpen} 
        onClose={() => setIsAnalyzerOpen(false)} 
      />
    </div>
  );
};

export default App;