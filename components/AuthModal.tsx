
import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      inputRef.current?.focus();
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
      await login(email);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div ref={modalRef} className="bg-base-100 dark:bg-dark-200 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/10 animate-fade-in-up relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-base-content-secondary hover:text-base-content rounded-full hover:bg-base-200 dark:hover:bg-dark-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <div className="p-8 pt-12 text-center">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-base-content dark:text-dark-content mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-base-content-secondary dark:text-dark-content-secondary text-sm mb-8">
                {isLogin ? 'Sign in to continue generating amazing content.' : 'Join us to start creating professional copy in seconds.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                    <label className="block text-xs font-bold text-base-content-secondary uppercase tracking-wider mb-1 ml-1">Email</label>
                    <input 
                        ref={inputRef}
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-base-200 dark:bg-dark-300 border-2 border-transparent rounded-xl focus:bg-base-100 dark:focus:bg-dark-200 focus:border-brand-primary outline-none transition-all" 
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-base-content-secondary uppercase tracking-wider mb-1 ml-1">Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-base-200 dark:bg-dark-300 border-2 border-transparent rounded-xl focus:bg-base-100 dark:focus:bg-dark-200 focus:border-brand-primary outline-none transition-all" 
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-3.5 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-brand-primary/30 transform hover:-translate-y-0.5 transition-all flex items-center justify-center"
                >
                    {isLoading ? (
                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        isLogin ? 'Sign In' : 'Create Account'
                    )}
                </button>
            </form>

            <div className="mt-6 text-sm text-base-content-secondary">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-brand-primary font-bold hover:underline">
                    {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
