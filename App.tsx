import React, { useState, useCallback, useMemo } from 'react';
import { AppStep } from './types';
import UploadStep from './components/UploadStep';
import PaymentStep from './components/PaymentStep';
import GenerationStep from './components/GenerationStep';
import ResultsStep from './components/ResultsStep';
import SubscriptionStep from './components/SubscriptionStep';
import Header from './components/Header';
import { generatePersonDescription, generateTwinImages, recreateWithTwin } from './services/geminiService';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

const App: React.FC = () => {
  const [appStep, setAppStep] = useState<AppStep>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [personDescription, setPersonDescription] = useState<string | null>(null);

  // State for coin system and recreation
  const [userCoins, setUserCoins] = useState<number>(20); // Start with 20 bonus coins
  const [recreatedImage, setRecreatedImage] = useState<string | null>(null);
  const [isRecreating, setIsRecreating] = useState(false);
  const [recreationError, setRecreationError] = useState<string | null>(null);

  const RECREATION_COST = 10;
  
  const handleProceedToPayment = useCallback(() => {
    if (uploadedFiles.length < 5 || uploadedFiles.length > 10) {
      setError("Please upload between 5 and 10 images.");
      return;
    }
    setError(null);
    setAppStep('payment');
  }, [uploadedFiles]);

  const handlePaymentSuccess = useCallback(async () => {
    setAppStep('generating');
    try {
      const imageBase64s = await Promise.all(uploadedFiles.map(fileToBase64));
      const description = await generatePersonDescription(imageBase64s);
      setPersonDescription(description);
      
      const images = await generateTwinImages(description);
      setGeneratedImages(images);
      setAppStep('results');
    } catch (err) {
      console.error(err);
      setError("An error occurred while generating your AI Twin. Please try again.");
      setAppStep('upload');
    }
  }, [uploadedFiles]);

  const handleSaveAndContinue = useCallback(() => {
    setAppStep('subscribe');
  }, []);

  const handleReset = useCallback(() => {
    setUploadedFiles([]);
    setGeneratedImages([]);
    setError(null);
    setRecreatedImage(null);
    setIsRecreating(false);
    setRecreationError(null);
    setPersonDescription(null);
    setUserCoins(20); // Reset coins for the demo
    setAppStep('upload');
  }, []);

  const handlePurchaseCoins = (amount: number) => {
    setUserCoins(prevCoins => prevCoins + amount);
    setRecreationError(null); // Clear any "insufficient coins" error
  };

  const handleRecreate = async (referenceImage: string) => {
    if (userCoins < RECREATION_COST) {
      setRecreationError(`You need ${RECREATION_COST} coins to recreate. Please purchase more.`);
      return;
    }

    if (!personDescription) {
      setRecreationError("AI Twin description not found. Please start over.");
      return;
    }

    setIsRecreating(true);
    setRecreationError(null);
    setRecreatedImage(null);

    try {
      const referenceImageBase64 = referenceImage.split(',')[1];
      const newImage = await recreateWithTwin(personDescription, referenceImageBase64);
      setRecreatedImage(newImage);
      setUserCoins(prevCoins => prevCoins - RECREATION_COST);
    } catch (err) {
      console.error(err);
      setRecreationError("Failed to recreate image. Please try again.");
    } finally {
      setIsRecreating(false);
    }
  };
  
  const renderStep = () => {
    switch (appStep) {
      case 'upload':
        return <UploadStep onFilesSelect={setUploadedFiles} files={uploadedFiles} onProceed={handleProceedToPayment} error={error} />;
      case 'payment':
        return <PaymentStep onPaymentSuccess={handlePaymentSuccess} onBack={() => setAppStep('upload')} />;
      case 'generating':
        return <GenerationStep />;
      case 'results':
        return <ResultsStep images={generatedImages} onContinue={handleSaveAndContinue} onRestart={handleReset} />;
      case 'subscribe':
        return <SubscriptionStep 
                  onRestart={handleReset}
                  userCoins={userCoins}
                  onPurchaseCoins={handlePurchaseCoins}
                  onRecreate={handleRecreate}
                  recreatedImage={recreatedImage}
                  isRecreating={isRecreating}
                  recreationError={recreationError}
                  recreationCost={RECREATION_COST}
                />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10"></div>
      <Header />
      <main className="w-full max-w-7xl flex-grow flex items-center justify-center">
        {renderStep()}
      </main>
    </div>
  );
};

export default App;