import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-7xl mb-8 text-center animate-fade-in">
      <div className="inline-flex items-center gap-3 bg-brand-dark-2/80 border border-brand-purple/20 rounded-full px-6 py-3 shadow-lg shadow-brand-purple/10">
        <SparklesIcon className="w-8 h-8 text-brand-purple animate-pulse" />
        <h1 className="text-2xl sm:text-3xl font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-purple">
          Digital Ai Twin
        </h1>
      </div>
    </header>
  );
};

export default Header;
