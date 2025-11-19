
import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

interface HeaderProps {
  onOpenGlossary: () => void;
  onOpenHistory: () => void;
  onOpenAuth: () => void;
  onOpenPricing: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGlossary, onOpenHistory, onOpenAuth, onOpenPricing }) => {
  const { user, plan, credits, logout, MAX_FREE_CREDITS } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-4 z-50 px-4 mb-6">
      <header className="container mx-auto max-w-7xl bg-base-100/80 dark:bg-dark-200/90 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl rounded-2xl transition-all duration-300">
        <div className="px-4 py-3 md:px-6 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-brand-primary p-2 rounded-xl shadow-lg shadow-brand-primary/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-base-content dark:text-dark-content tracking-tight">
              Copy<span className="text-brand-primary">Gen</span>
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
             {/* Credits Counter (for Free Plan users) */}
             {user && plan === 'free' && (
                <div 
                    className="hidden md:flex items-center px-3 py-1.5 bg-base-200 dark:bg-dark-300 rounded-lg text-xs font-bold text-base-content-secondary cursor-pointer hover:bg-base-300 transition-colors"
                    onClick={onOpenPricing}
                    title="Upgrade for unlimited credits"
                >
                    <span className={`mr-1 ${credits === 0 ? 'text-red-500' : 'text-brand-primary'}`}>{credits}/{MAX_FREE_CREDITS}</span> Credits
                </div>
            )}

            {/* History Button */}
            <button 
                onClick={onOpenHistory}
                className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 rounded-xl bg-base-200/50 dark:bg-dark-300/50 hover:bg-brand-primary/10 hover:text-brand-primary transition-all duration-200 text-sm font-bold text-base-content-secondary dark:text-dark-content-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 group"
                aria-label="History"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">History</span>
            </button>

            {/* Glossary Button */}
            <button 
                onClick={onOpenGlossary}
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-base-200/50 dark:bg-dark-300/50 hover:bg-brand-primary/10 hover:text-brand-primary transition-all duration-200 text-sm font-bold text-base-content-secondary dark:text-dark-content-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 group"
                aria-label="Glossary"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="hidden sm:inline">Glossary</span>
            </button>

            {/* Auth / User Menu */}
            {user ? (
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-full bg-base-200 dark:bg-dark-300 hover:ring-2 hover:ring-brand-primary/50 transition-all"
                    >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        {plan === 'pro' && (
                            <span className="bg-brand-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mr-1">
                                PRO
                            </span>
                        )}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content-secondary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-base-100 dark:bg-dark-200 border border-base-300 dark:border-dark-300 rounded-xl shadow-xl overflow-hidden animate-fade-in-up origin-top-right">
                            <div className="px-4 py-3 border-b border-base-300 dark:border-dark-300">
                                <p className="text-sm font-bold text-base-content dark:text-dark-content truncate">{user.name}</p>
                                <p className="text-xs text-base-content-secondary dark:text-dark-content-secondary truncate">{user.email}</p>
                            </div>
                            
                            {plan === 'free' && (
                                <div className="p-3">
                                    <button onClick={() => { setIsUserMenuOpen(false); onOpenPricing(); }} className="w-full py-2 bg-brand-primary hover:bg-brand-secondary text-white text-sm font-bold rounded-lg transition-colors shadow-md">
                                        Upgrade to Pro
                                    </button>
                                </div>
                            )}

                            <div className="py-1">
                                <button onClick={() => { setIsUserMenuOpen(false); logout(); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-base-200 dark:hover:bg-dark-300 transition-colors flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <button 
                    onClick={onOpenAuth}
                    className="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-brand-primary/20"
                >
                    Sign In
                </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};
