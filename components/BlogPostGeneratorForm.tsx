
import React, { useState } from 'react';
import { TONES } from '../constants';
import type { BlogPostFormData } from '../types';

interface BlogPostGeneratorFormProps {
  onSubmit: (formData: BlogPostFormData) => void;
  isLoading: boolean;
}

const InputField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; required?: boolean; error?: string }> = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-base-content-secondary dark:text-dark-content-secondary mb-2 ml-1">{label}</label>
        <input 
            id={id} 
            name={id} 
            type="text" 
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props} 
            className={`w-full px-4 py-3 bg-base-200 dark:bg-dark-300 border-2 rounded-xl focus:bg-base-100 dark:focus:bg-dark-200 focus:ring-0 transition duration-200 outline-none placeholder-base-content-secondary/50 ${error ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-brand-primary'}`}
        />
        {error && <p id={`${id}-error`} role="alert" className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
);

export const BlogPostGeneratorForm: React.FC<BlogPostGeneratorFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<BlogPostFormData>({
    topic: '',
    keywords: '',
    tone: TONES[0].name,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  
  const handleToneSelect = (toneName: string) => {
    setFormData(prev => ({ ...prev, tone: toneName }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.topic.trim()) newErrors.topic = 'Topic is required';
    if (!formData.keywords.trim()) newErrors.keywords = 'Keywords are required';
    
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
            <InputField label="Blog Post Topic" id="topic" value={formData.topic} onChange={handleInputChange} placeholder="e.g., The Future of Renewable Energy" error={errors.topic} />
            <InputField label="Keywords" id="keywords" value={formData.keywords} onChange={handleInputChange} placeholder="e.g., solar, wind, sustainability" error={errors.keywords} />
            
            <div>
                <label id="tone-label" className="block text-sm font-semibold text-base-content-secondary dark:text-dark-content-secondary mb-3 ml-1">Tone / Style</label>
                <div role="radiogroup" aria-labelledby="tone-label" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            <div className="flex items-center justify-between mb-1">
                                <p className="font-bold text-sm text-base-content dark:text-dark-content">{toneOption.name}</p>
                                {formData.tone === toneOption.name && (
                                    <div className="h-4 w-4 rounded-full bg-brand-primary"></div>
                                )}
                            </div>
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
            {isLoading ? 'Generating...' : 'Generate Blog Post'}
            </button>
        </form>
    </div>
  );
};
