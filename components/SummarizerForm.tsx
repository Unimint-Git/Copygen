
import React, { useState } from 'react';
import type { SummarizeFormData } from '../types';

interface SummarizerFormProps {
  onSubmit: (formData: SummarizeFormData) => void;
  isLoading: boolean;
}

const TextareaField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number; error?: string }> = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-base-content-secondary dark:text-dark-content-secondary mb-2 ml-1">{label}</label>
        <textarea 
            id={id} 
            name={id} 
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props} 
            className={`w-full px-4 py-3 bg-base-200 dark:bg-dark-300 border-2 rounded-xl focus:bg-base-100 dark:focus:bg-dark-200 focus:ring-0 transition duration-200 outline-none placeholder-base-content-secondary/50 resize-none ${error ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-brand-primary'}`}
        ></textarea>
        {error && <p id={`${id}-error`} role="alert" className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
);

const lengths = [
    { id: 'short', label: 'Short Paragraph', description: '1-2 sentences' },
    { id: 'medium', label: 'Medium Paragraph', description: '3-5 sentences' },
    { id: 'long', label: 'Long Paragraph', description: 'Detailed summary' },
    { id: 'bullets', label: 'Bullet Points', description: 'List of key points' },
];

export const SummarizerForm: React.FC<SummarizerFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<SummarizeFormData>({
    text: '',
    length: 'medium',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
  };

  const handleLengthSelect = (lengthId: any) => {
    setFormData(prev => ({ ...prev, length: lengthId }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.text.trim()) newErrors.text = 'Text is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
        onSubmit(formData);
    }
  };

  return (
    <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <TextareaField 
                label="Text to Summarize" 
                id="text" 
                value={formData.text} 
                onChange={handleInputChange} 
                placeholder="Paste the article, report, or long text you want to summarize here..." 
                rows={8} 
                error={errors.text}
            />

            <div>
                <label id="length-label" className="block text-sm font-semibold text-base-content-secondary dark:text-dark-content-secondary mb-3 ml-1">Summary Length</label>
                <div role="radiogroup" aria-labelledby="length-label" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lengths.map((len) => (
                        <div
                            key={len.id}
                            onClick={() => handleLengthSelect(len.id)}
                            role="radio"
                            aria-checked={formData.length === len.id}
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleLengthSelect(len.id)}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                                formData.length === len.id
                                    ? 'border-brand-primary bg-brand-primary/5'
                                    : 'border-transparent bg-base-200 dark:bg-dark-300 hover:bg-base-300 dark:hover:bg-dark-100'
                            }`}
                        >
                            <p className="font-bold text-sm text-base-content dark:text-dark-content mb-1">{len.label}</p>
                            <p className="text-xs text-base-content-secondary dark:text-dark-content-secondary">{len.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full flex justify-center items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Summarizing...
                </>
            ) : (
                'Generate Summary'
            )}
            </button>
        </form>
    </div>
  );
};
