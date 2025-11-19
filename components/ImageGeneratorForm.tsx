
import React, { useState } from 'react';
import type { ImageGeneratorFormData } from '../types';

interface ImageGeneratorFormProps {
  onSubmit: (formData: ImageGeneratorFormData) => void;
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

const aspectRatios: ImageGeneratorFormData['aspectRatio'][] = ['1:1', '16:9', '9:16', '4:3', '3:4'];

export const ImageGeneratorForm: React.FC<ImageGeneratorFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ImageGeneratorFormData>({
    prompt: '',
    aspectRatio: '1:1',
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
  
  const handleAspectRatioChange = (ratio: ImageGeneratorFormData['aspectRatio']) => {
    setFormData(prev => ({ ...prev, aspectRatio: ratio }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.prompt.trim()) newErrors.prompt = 'Prompt is required';
    
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
            <TextareaField label="Image Prompt" id="prompt" value={formData.prompt} onChange={handleInputChange} placeholder="e.g., A photo of a futuristic city at sunset, with flying cars and neon lights" rows={4} error={errors.prompt} />

            <div>
                <label id="ratio-label" className="block text-sm font-semibold text-base-content-secondary dark:text-dark-content-secondary mb-3 ml-1">Aspect Ratio</label>
                <div role="group" aria-labelledby="ratio-label" className="flex flex-wrap gap-3">
                    {aspectRatios.map(ratio => (
                        <button
                            type="button"
                            key={ratio}
                            onClick={() => handleAspectRatioChange(ratio)}
                            aria-pressed={formData.aspectRatio === ratio}
                            className={`px-5 py-2.5 text-sm font-bold rounded-full transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                                formData.aspectRatio === ratio
                                    ? 'bg-brand-primary border-brand-primary text-white shadow-md'
                                    : 'bg-base-100 dark:bg-dark-300 border-base-200 dark:border-dark-300 hover:border-brand-primary/50'
                            }`}
                        >
                            {ratio}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full flex justify-center items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
            {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
        </form>
    </div>
  );
};
