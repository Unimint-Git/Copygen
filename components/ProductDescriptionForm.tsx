
import React, { useState } from 'react';
import { TONES } from '../constants';
import type { ProductDescriptionFormData } from '../types';

interface ProductDescriptionFormProps {
  onSubmit: (formData: ProductDescriptionFormData) => void;
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

export const ProductDescriptionForm: React.FC<ProductDescriptionFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ProductDescriptionFormData>({
    productName: '',
    features: '',
    targetAudience: '',
    tone: TONES[0].name,
    format: 'mixed',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleFormatSelect = (format: ProductDescriptionFormData['format']) => {
    setFormData(prev => ({ ...prev, format }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.productName.trim()) newErrors.productName = 'Product Name is required';
    if (!formData.targetAudience.trim()) newErrors.targetAudience = 'Target Audience is required';
    if (!formData.features.trim()) newErrors.features = 'Features are required';
    
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField 
                    label="Product Name" 
                    id="productName" 
                    value={formData.productName} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Ergonomic Office Chair" 
                    error={errors.productName} 
                />
                <InputField 
                    label="Target Audience" 
                    id="targetAudience" 
                    value={formData.targetAudience} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Remote workers, Gamers" 
                    error={errors.targetAudience} 
                />
            </div>
            
            <TextareaField 
                label="Key Features & Benefits" 
                id="features" 
                value={formData.features} 
                onChange={handleInputChange} 
                placeholder="- Adjustable lumbar support&#10;- Breathable mesh material&#10;- 5-year warranty" 
                rows={4} 
                error={errors.features}
            />

            <div>
                <label id="format-label" className="block text-sm font-semibold text-base-content-secondary dark:text-dark-content-secondary mb-3 ml-1">Format</label>
                <div role="group" aria-labelledby="format-label" className="flex bg-base-200 dark:bg-dark-300 p-1.5 rounded-xl">
                    {[
                        { id: 'paragraph', label: 'Paragraphs' },
                        { id: 'bullets', label: 'Bullet Points' },
                        { id: 'mixed', label: 'Mixed (Best for Sales)' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => handleFormatSelect(item.id as any)}
                            aria-pressed={formData.format === item.id}
                            className={`flex-1 py-3 px-4 text-sm font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                                formData.format === item.id
                                    ? 'bg-white dark:bg-dark-200 text-brand-primary shadow-sm'
                                    : 'text-base-content-secondary dark:text-dark-content-secondary hover:text-base-content dark:hover:text-dark-content'
                            }`}
                        >
                            {item.label}
                        </button>
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
                    Generating...
                </>
            ) : (
                'Generate Description'
            )}
            </button>
        </form>
    </div>
  );
};
