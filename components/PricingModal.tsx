
import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const { upgrade, plan } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
        await upgrade();
        onClose();
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-base-100 dark:bg-dark-200 rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden relative animate-fade-in-up max-h-[90vh] flex flex-col">
        
        <button onClick={onClose} className="absolute top-6 right-6 p-2 z-10 text-base-content-secondary hover:text-base-content bg-base-200/50 dark:bg-dark-300/50 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <div className="p-8 md:p-12 text-center overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content dark:text-dark-content mb-4">
                Unlock Your Full Potential
            </h2>
            <p className="text-lg text-base-content-secondary dark:text-dark-content-secondary mb-12 max-w-2xl mx-auto">
                Get unlimited generations, access to advanced AI models, and exclusive tools designed for professionals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {/* Free Plan */}
                <div className="border-2 border-base-200 dark:border-dark-300 rounded-3xl p-8 text-left relative opacity-70 hover:opacity-100 transition-opacity">
                    <h3 className="text-xl font-bold text-base-content dark:text-dark-content mb-2">Free Starter</h3>
                    <div className="text-3xl font-bold mb-6">$0 <span className="text-sm font-normal text-base-content-secondary">/ month</span></div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center text-sm"><span className="text-green-500 mr-3">✓</span> 3 Generations per session</li>
                        <li className="flex items-center text-sm"><span className="text-green-500 mr-3">✓</span> Basic Tools (Website, Blog)</li>
                        <li className="flex items-center text-sm"><span className="text-green-500 mr-3">✓</span> Standard Support</li>
                        <li className="flex items-center text-sm text-base-content-secondary"><span className="text-gray-400 mr-3">×</span> No Image Generation</li>
                        <li className="flex items-center text-sm text-base-content-secondary"><span className="text-gray-400 mr-3">×</span> No Content Repurposing</li>
                    </ul>
                    <button 
                        disabled={true} 
                        className="w-full py-3 rounded-xl font-bold bg-base-200 dark:bg-dark-300 text-base-content-secondary cursor-default"
                    >
                        Current Plan
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="border-2 border-brand-primary bg-brand-primary/5 rounded-3xl p-8 text-left relative transform scale-105 shadow-xl">
                    <div className="absolute top-0 right-0 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                        RECOMMENDED
                    </div>
                    <h3 className="text-xl font-bold text-brand-primary mb-2">Pro Creator</h3>
                    <div className="text-3xl font-bold mb-6 text-base-content dark:text-dark-content">$19 <span className="text-sm font-normal text-base-content-secondary">/ month</span></div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center text-sm font-medium"><span className="text-brand-primary mr-3">✓</span> Unlimited Generations</li>
                        <li className="flex items-center text-sm font-medium"><span className="text-brand-primary mr-3">✓</span> All Tools Unlocked</li>
                        <li className="flex items-center text-sm font-medium"><span className="text-brand-primary mr-3">✓</span> Advanced Image Generation</li>
                        <li className="flex items-center text-sm font-medium"><span className="text-brand-primary mr-3">✓</span> Content Repurposing Suite</li>
                        <li className="flex items-center text-sm font-medium"><span className="text-brand-primary mr-3">✓</span> Priority Support</li>
                    </ul>
                    <button 
                        onClick={handleUpgrade}
                        disabled={isLoading || plan === 'pro'}
                        className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg hover:shadow-xl hover:shadow-brand-primary/30 transform hover:-translate-y-0.5 transition-all"
                    >
                        {isLoading ? 'Processing...' : (plan === 'pro' ? 'Active Plan' : 'Upgrade to Pro')}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
