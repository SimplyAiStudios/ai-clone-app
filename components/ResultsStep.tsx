import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultsStepProps {
  images: string[];
  onContinue: () => void;
  onRestart: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ images, onContinue, onRestart }) => {
  
  const handleDownload = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `ai-twin-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback for cross-origin issues if any
      window.open(url, '_blank');
    }
  };
  
  return (
    <div className="w-full text-center animate-fade-in">
      <h2 className="text-3xl font-display mb-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-purple">Your AI Twin is Ready!</h2>
      <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Here are four unique, high-quality portraits of your new digital self. Download your favorites and save your twin to unlock more features.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {images.map((image, index) => (
          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-brand-purple/30 shadow-lg animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
            <img src={image} alt={`Generated AI Twin ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button 
                onClick={() => handleDownload(image, index)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                <DownloadIcon className="w-5 h-5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onContinue}
          className="w-full sm:w-auto px-10 py-4 font-bold text-lg rounded-full transition-all duration-300
                     bg-gradient-to-r from-brand-indigo to-brand-purple
                     hover:shadow-lg hover:shadow-brand-purple/50"
        >
          Save My Twin & Continue
        </button>
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-10 py-4 font-bold text-lg rounded-full transition-all duration-300
                     bg-brand-dark-2/80 border border-brand-purple/50 text-white
                     hover:bg-brand-purple/20"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ResultsStep;