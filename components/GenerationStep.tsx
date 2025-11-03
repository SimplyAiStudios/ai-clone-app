import React, { useState, useEffect } from 'react';

const messages = [
  "Initializing digital neuro-engine...",
  "Analyzing facial structures and expressions...",
  "Synthesizing your unique digital persona...",
  "Weaving pixels into a high-resolution portrait...",
  "Applying final aesthetic enhancements...",
  "Almost there! Your AI twin is taking shape."
];

const GenerationStep: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setCurrentMessage(messages[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
      <div className="w-32 h-32 mb-8 border-4 border-brand-purple rounded-full animate-pulse-glow">
        <div className="w-full h-full rounded-full border-4 border-brand-indigo animate-spin"></div>
      </div>
      <h2 className="text-3xl font-display mb-4 text-white">Crafting Your Digital Twin</h2>
      <p className="text-lg text-brand-purple max-w-md transition-opacity duration-500">{currentMessage}</p>
      <p className="text-gray-400 mt-8">This process can take a few moments. Please don't refresh the page.</p>
    </div>
  );
};

export default GenerationStep;