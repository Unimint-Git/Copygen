
import React, { useEffect, useRef } from 'react';

interface GlossaryProps {
  isOpen: boolean;
  onClose: () => void;
}

const TERMS = [
  { term: "SEO (Search Engine Optimization)", definition: "The practice of optimizing content to be discovered by search engines like Google. Good SEO helps your site appear higher in search results." },
  { term: "Keywords", definition: "Specific words or phrases that people type into search engines. Strategically placing these in your content helps search engines understand your topic." },
  { term: "H1 (Heading 1)", definition: "The main headline of a webpage. There should typically be only one H1 per page, and it should clearly state the page's main topic." },
  { term: "H2, H3 (Subheadings)", definition: "Secondary headings used to break up text into readable sections. They create a hierarchy that helps both readers and search engines scan your content." },
  { term: "CTA (Call to Action)", definition: "A clear instruction telling the user what to do next, like 'Buy Now', 'Sign Up', or 'Contact Us'. Strong CTAs drive conversions." },
  { term: "Meta Description", definition: "A short summary (approx. 155 characters) displayed under your page title in search results. It acts as a pitch to entice users to click." },
  { term: "Value Proposition", definition: "A clear statement that explains the benefit of your offer, how you solve your customer's problem, and what distinguishes you from the competition." },
  { term: "Tone of Voice", definition: "The personality your brand expresses through words (e.g., professional, witty, authoritative). It should be consistent across all content." },
  { term: "Above the Fold", definition: "The content visible on a screen without scrolling. Key messages and CTAs are often placed here to capture immediate attention." },
  { term: "Landing Page", definition: "A standalone web page created specifically for a marketing campaign. It is designed with a single focus or goal." },
  { term: "Alt Text", definition: "A text description of an image used by screen readers for accessibility and by search engines to understand the image content." },
  { term: "Copy", definition: "Text written for marketing or advertising purposes, designed to persuade an audience to take a specific action." }
];

export const Glossary: React.FC<GlossaryProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
        
        // Focus management
        setTimeout(() => {
            closeButtonRef.current?.focus();
        }, 100);
    }
    return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="glossary-title"
    >
      <div 
        ref={modalRef}
        className="bg-base-100 dark:bg-dark-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col transform transition-all duration-300 scale-100"
      >
        <div className="p-6 border-b border-base-300 dark:border-dark-300 flex justify-between items-center bg-base-200/50 dark:bg-dark-300/50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-brand-primary/10 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
             </div>
             <h2 id="glossary-title" className="text-2xl font-bold text-base-content dark:text-dark-content">Copywriting Glossary</h2>
          </div>
          <button 
            ref={closeButtonRef}
            onClick={onClose} 
            className="p-2 hover:bg-base-300 dark:hover:bg-dark-100 rounded-full transition-colors text-base-content-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label="Close glossary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {TERMS.map((item, index) => (
               <div key={index} className="p-5 border border-base-300 dark:border-dark-300 rounded-xl hover:border-brand-primary/50 hover:shadow-md transition-all duration-200 bg-base-100 dark:bg-dark-200 group">
                 <h3 className="text-lg font-bold text-brand-primary mb-2 group-hover:text-brand-secondary transition-colors">{item.term}</h3>
                 <p className="text-sm text-base-content dark:text-dark-content leading-relaxed">{item.definition}</p>
               </div>
             ))}
           </div>
        </div>
        
        <div className="p-4 border-t border-base-300 dark:border-dark-300 bg-base-200/30 dark:bg-dark-300/30 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-medium rounded-full transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          >
            Close Glossary
          </button>
        </div>
      </div>
    </div>
  );
};
