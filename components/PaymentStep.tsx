import React, { useState } from 'react';
import { CreditCardIcon } from './icons/CreditCardIcon';

interface PaymentStepProps {
  onPaymentSuccess: () => void;
  onBack: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ onPaymentSuccess, onBack }) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'TWIN') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-slow">
      <div className="bg-brand-dark-2/80 backdrop-blur-sm border border-brand-purple/20 rounded-2xl p-8 shadow-2xl shadow-brand-purple/10 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-brand-dark rounded-full border border-brand-purple/30">
            <CreditCardIcon className="w-10 h-10 text-brand-purple" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-purple">Confirm Your Purchase</h2>
        <p className="text-gray-400 mb-6">You're one step away from meeting your digital twin.</p>
        
        {promoApplied ? (
          <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 mb-8 text-center animate-fade-in">
            <p className="font-bold text-green-300">Promo Code "TWIN" Applied!</p>
            <p className="text-green-400 text-sm">You can generate your twin for free.</p>
          </div>
        ) : (
          <>
            <div className="bg-brand-dark-2/50 rounded-lg p-4 mb-6 border border-brand-purple/20">
              <div className="flex justify-between items-center text-lg">
                <span className="text-gray-300">Digital AI Twin Generation</span>
                <span className="font-bold text-white">$9.99</span>
              </div>
            </div>
            <div className="mb-8 text-left">
              <label htmlFor="promo" className="block text-sm font-medium text-gray-400 mb-2">Have a promo code?</label>
              <div className="flex gap-2">
                <input
                  id="promo"
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    if (promoError) setPromoError('');
                  }}
                  placeholder="Enter code"
                  className="flex-grow bg-brand-dark border border-brand-purple/30 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 font-semibold text-sm rounded-md transition-colors bg-brand-purple/50 text-white hover:bg-brand-purple/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!promoCode.trim()}
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-red-400 text-sm mt-2">{promoError}</p>}
            </div>
          </>
        )}

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onPaymentSuccess}
            className="w-full px-10 py-4 font-bold text-lg rounded-full transition-all duration-300
                       bg-gradient-to-r from-brand-indigo to-brand-purple
                       hover:shadow-lg hover:shadow-brand-purple/50"
          >
            {promoApplied ? 'Generate Your Twin' : 'Pay & Generate Your Twin'}
          </button>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;