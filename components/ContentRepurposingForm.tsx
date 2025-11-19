
import React, { useState } from 'react';
import { TONES, REPURPOSE_FORMATS } from '../constants';
import type { ContentRepurposingFormData } from '../types';

interface ContentRepurposingFormProps {
  onSubmit: (formData: ContentRepurposingFormData) => void;
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

export const ContentRepurposingForm: React.FC<ContentRepurposingFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ContentRepurposingFormData>({
    originalContent: '',
    targetFormat: REPURPOSE_FORMATS[0],
    tone: TONES[0].name,
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

  const handleFormatSelect = (format: string) => {
    setFormData(prev => ({ ...prev, targetFormat: format }));
  };

  const handleToneSelect = (toneName: string) => {
    setFormData(prev => ({ ...prev, tone: toneName }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.originalContent.trim()) newErrors.originalContent = 'Content is required';
    
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
                label="Original Content" 
                id="originalContent" 
                value={formData.originalContent} 
                onChange={handleInputChange} 
                placeholder="Paste your blog post, article, video transcript, or any text here..." 
                rows={6} 
                error={errors.originalContent}
            />
            
            <div>
                <label id="format-label" className="block text-sm font-semibold text-base-content-secondary dark:text-dark-content-secondary mb-3 ml-1">Target Format</label>
                <div role="radiogroup" aria-labelledby="format-label" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {REPURPOSE_FORMATS.map(format => (
                        <div
                            key={format}
                            onClick={() => handleFormatSelect(format)}
                            role="radio"
                            aria-checked={formData.targetFormat === format}
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleFormatSelect(format)}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary flex items-center justify-between ${
                                formData.targetFormat === format
                                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                                    : 'border-transparent bg-base-200 dark:bg-dark-300 hover:bg-base-300 dark:hover:bg-dark-100 text-base-content dark:text-dark-content'
                            }`}
                        >
                            <span className="font-bold text-sm">{format}</span>
                            {formData.targetFormat === format && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label id="tone-label" className="block text-sm font-semibold text-base-content-secondary dark:text-dark-content-secondary mb-3 ml-1">Tone / Style</label>
                <div role="radiogroup" aria-labelledby="tone-label" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {TONES.map((toneOption) => (
                        <div
                            key={toneOption.name}
                            onClick={() => handleToneSelect(toneOption.name)}
                            role="radio"
                            aria-checked={formData.tone === toneOption.name}
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleToneSelect(toneOption.name)}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                                formData.tone === toneOption.name
                                    ? 'border-brand-primary bg-brand-primary/5'
                                    : 'border-transparent bg-base-200 dark:bg-dark-300 hover:bg-base-300 dark:hover:bg-dark-100'
                            }`}
                        >
                            <p className="font-bold text-sm text-base-content dark:text-dark-content mb-1">{toneOption.name}</p>
                            <p className="text-xs text-base-content-secondary dark:text-dark-content-secondary">{toneOption.description}</p>
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
                    Repurposing...
                </>
            ) : (
                'Repurpose Content'
            )}
            </button>
        </form>
    </div>
  );
};
