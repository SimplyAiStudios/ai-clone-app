import React, { useState, useCallback, ChangeEvent } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { CoinIcon } from './icons/CoinIcon';

interface SubscriptionStepProps {
  onRestart: () => void;
  userCoins: number;
  onPurchaseCoins: (amount: number) => void;
  onRecreate: (referenceImage: string) => Promise<void>;
  recreatedImage: string | null;
  isRecreating: boolean;
  recreationError: string | null;
  recreationCost: number;
}

const SubscriptionStep: React.FC<SubscriptionStepProps> = ({ 
  onRestart,
  userCoins,
  onPurchaseCoins,
  onRecreate,
  recreatedImage,
  isRecreating,
  recreationError,
  recreationCost
}) => {
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
        if (recreatedImage) {
          // This allows recreating with a new image without a full reset
          // In a real app, we might clear the old recreated image here.
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecreateClick = useCallback(async () => {
    if (!referenceImage) {
      return;
    }
    await onRecreate(referenceImage);
  }, [referenceImage, onRecreate]);

  return (
    <div className="w-full max-w-5xl animate-fade-in-slow space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-display mb-3 text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-purple">Unlock Your Twin's Potential</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Your AI Twin is saved! Now, purchase coins to bring your creative visions to life by recreating any image with your twin's face.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Coin Purchase Plans */}
        <div className="bg-brand-dark-2/80 backdrop-blur-sm border border-brand-purple/20 rounded-2xl p-8 shadow-2xl shadow-brand-purple/10">
          <h3 className="text-2xl font-bold text-center mb-6">Purchase Coins</h3>
          <div className="space-y-4">
            <button onClick={() => onPurchaseCoins(20)} className="w-full p-4 border-2 border-brand-purple/50 rounded-lg bg-brand-purple/10 text-center hover:bg-brand-purple/20 transition-colors">
              <p className="font-bold text-lg">Starter Pack</p>
              <p className="text-2xl font-display">$4.99</p>
              <p className="text-sm text-gray-300">Get 20 Coins</p>
            </button>
            <button onClick={() => onPurchaseCoins(100)} className="w-full p-4 border border-brand-purple/30 rounded-lg text-center hover:bg-brand-purple/20 transition-colors">
              <p className="font-bold text-lg">Creator Pack</p>
              <p className="text-2xl font-display">$14.99</p>
              <p className="text-sm text-gray-300">Get 100 Coins</p>
            </button>
          </div>
        </div>

        {/* Recreate Feature */}
        <div className="bg-brand-dark-2/80 backdrop-blur-sm border border-brand-purple/20 rounded-2xl p-8 shadow-2xl shadow-brand-purple/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Try It Now!</h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-dark rounded-full border border-brand-purple/30">
              <CoinIcon className="w-5 h-5 text-brand-purple" />
              <span className="font-bold text-lg">{userCoins}</span>
              <span className="text-gray-400 text-sm">Coins</span>
            </div>
          </div>
          <div className="space-y-4">
            {!referenceImage ? (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-brand-purple/50 rounded-lg cursor-pointer hover:border-brand-purple hover:bg-brand-dark-2/50 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <UploadIcon className="w-8 h-8 text-brand-purple/70 mb-1" />
                  <span className="text-sm font-semibold text-gray-300">Upload a reference image</span>
                  <span className="text-xs text-gray-500 mt-1">Click here to select a file</span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="text-center p-4 bg-brand-dark-2/30 rounded-lg border border-brand-purple/20 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-2 tracking-wider">REFERENCE PREVIEW</p>
                  <img src={referenceImage} alt="Reference Preview" className="max-h-32 mx-auto rounded-md border-2 border-brand-purple/50" />
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={handleRecreateClick} 
                    disabled={isRecreating} 
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-full bg-gradient-to-r from-brand-indigo to-brand-purple hover:shadow-lg hover:shadow-brand-purple/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRecreating ? 'Recreating...' : (
                      <>
                        <SparklesIcon className="w-5 h-5" />
                        Recreate ({recreationCost} Coins)
                      </>
                    )}
                  </button>
                  <label className="cursor-pointer text-brand-purple hover:text-brand-purple/80 transition-colors font-semibold text-sm">
                    Change Image
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isRecreating && <div className="text-center text-brand-purple animate-pulse">Recreating image with your twin...</div>}
      {recreationError && <div className="text-center text-red-400 font-semibold p-3 bg-red-900/20 border border-red-500/30 rounded-lg">{recreationError}</div>}

      {recreatedImage && (
        <div className="text-center animate-fade-in">
          <h3 className="text-2xl font-bold mb-4">Recreation Complete!</h3>
          <img src={recreatedImage} alt="Recreated with AI Twin" className="rounded-lg mx-auto max-w-full md:max-w-lg shadow-2xl shadow-black" />
        </div>
      )}
      
       <div className="text-center pt-8">
        <button
          onClick={onRestart}
          className="px-8 py-3 font-bold text-md rounded-full transition-all duration-300
                     bg-brand-dark-2/80 border border-brand-purple/50 text-white
                     hover:bg-brand-purple/20"
        >
          Create Another Twin
        </button>
      </div>

    </div>
  );
};

export default SubscriptionStep;