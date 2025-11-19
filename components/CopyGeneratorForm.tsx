
import React, { useState, useRef, useEffect } from 'react';
import { TONES, PAGE_OPTIONS } from '../constants';
import type { FormData } from '../types';

interface CopyGeneratorFormProps {
  onSubmit: (formData: FormData) => void;
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

const TextareaField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number; error?: string; showCount?: boolean }> = ({ label, id, error, showCount, ...props }) => (
    <div>
        <div className="flex justify-between items-center mb-2 ml-1">
            <label htmlFor={id} className="block text-sm font-semibold text-base-content-secondary dark:text-dark-content-secondary">{label}</label>
            {showCount && (
                <span className="text-xs text-base-content-secondary dark:text-dark-content-secondary opacity-70 font-medium" aria-hidden="true">
                    {props.value.length} chars
                </span>
            )}
        </div>
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

const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => (
    <div className="group relative h-full">
        {children}
        <div role="tooltip" className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 hidden group-hover:block w-48 p-3 bg-dark-200 dark:bg-base-100 text-white dark:text-dark-100 text-xs font-medium rounded-xl shadow-xl z-20 text-center pointer-events-none">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px border-4 border-transparent border-t-dark-200 dark:border-t-base-100"></div>
        </div>
    </div>
);

export const CopyGeneratorForm: React.FC<CopyGeneratorFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    location: '',
    tone: TONES[0].name,
    details: '',
    pages: ['homepage'],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isToneDropdownOpen, setIsToneDropdownOpen] = useState(false);
  const toneDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (toneDropdownRef.current && !toneDropdownRef.current.contains(event.target as Node)) {
            setIsToneDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toneDropdownRef]);

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

  const handleToneSelect = (toneOption: string) => {
    setFormData(prev => ({ ...prev, tone: toneOption }));
    setIsToneDropdownOpen(false);
  };

  const handlePageSelect = (pageId: string) => {
    setFormData(prev => {
      const newPages = prev.pages.includes(pageId)
        ? prev.pages.filter(p => p !== pageId)
        : [...prev.pages, pageId];
        
      if (errors.pages && newPages.length > 0) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.pages;
            return newErrors;
        });
      }
      return { ...prev, pages: newPages };
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.businessName.trim()) newErrors.businessName = 'Business Name is required';
    if (!formData.businessType.trim()) newErrors.businessType = 'Business Type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.pages.length === 0) newErrors.pages = 'Please select at least one page';
    
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
        <section aria-labelledby="section-business">
            <h2 id="section-business" className="text-lg font-bold mb-4 text-base-content dark:text-dark-content flex items-center">
                <span className="bg-brand-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</span>
                Business Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputField label="Business Name" id="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="e.g., Summit Coffee" error={errors.businessName} />
                <InputField label="Business Type" id="businessType" value={formData.businessType} onChange={handleInputChange} placeholder="e.g., Coffee Shop" error={errors.businessType} />
            </div>
            <div className="mb-6">
                <InputField label="Location" id="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Aspen, Colorado" error={errors.location} />
            </div>
            
            <div className="relative mb-6" ref={toneDropdownRef}>
                <label id="tone-label" className="block text-sm font-semibold text-base-content-secondary dark:text-dark-content-secondary mb-2 ml-1">Tone / Style</label>
                <button
                    type="button"
                    onClick={() => setIsToneDropdownOpen(!isToneDropdownOpen)}
                    className="w-full flex justify-between items-center px-4 py-3 bg-base-200 dark:bg-dark-300 border-2 border-transparent rounded-xl focus:outline-none focus:border-brand-primary focus:bg-base-100 dark:focus:bg-dark-200 transition duration-200 text-left"
                    aria-haspopup="listbox"
                    aria-expanded={isToneDropdownOpen}
                    aria-labelledby="tone-label"
                >
                    <span className={formData.tone ? 'text-base-content dark:text-dark-content' : 'text-base-content-secondary'}>{formData.tone}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-base-content-secondary transition-transform duration-200 ${isToneDropdownOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                {isToneDropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-base-100 dark:bg-dark-200 border border-base-300 dark:border-dark-300 rounded-2xl shadow-xl max-h-60 overflow-auto focus:outline-none custom-scrollbar">
                        <ul role="listbox" aria-labelledby="tone-label" className="p-2">
                            {TONES.map(toneOption => (
                                <li
                                    key={toneOption.name}
                                    onClick={() => handleToneSelect(toneOption.name)}
                                    onKeyDown={(e) => {if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleToneSelect(toneOption.name); }}}
                                    tabIndex={0}
                                    role="option"
                                    aria-selected={formData.tone === toneOption.name}
                                    className={`px-4 py-3 rounded-xl text-sm cursor-pointer transition-colors focus:outline-none focus:bg-base-200 dark:focus:bg-dark-300 ${
                                        formData.tone === toneOption.name 
                                            ? 'bg-brand-primary/10 text-brand-primary font-semibold' 
                                            : 'text-base-content dark:text-dark-content hover:bg-base-200 dark:hover:bg-dark-300'
                                    }`}
                                >
                                    {toneOption.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <TextareaField 
                label="Description & Extra Details" 
                id="details" 
                value={formData.details} 
                onChange={handleInputChange} 
                placeholder="Tell us more about your business. What makes you unique? Who are your customers?" 
                rows={4} 
                showCount={true}
            />
        </section>

        <div className="h-px bg-base-300 dark:bg-dark-300" role="separator" />

        <section aria-labelledby="section-pages">
            <h2 id="section-pages" className="text-lg font-bold mb-4 text-base-content dark:text-dark-content flex items-center">
                <span className="bg-brand-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</span>
                Pages to Generate
            </h2>
            {errors.pages && <p id="pages-error" role="alert" className="text-red-500 text-sm mb-2 ml-1">{errors.pages}</p>}
            <div 
                role="group" 
                aria-label="Select pages to generate"
                className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${errors.pages ? 'p-2 border-2 border-red-500/50 rounded-3xl bg-red-50/5 dark:bg-red-900/10' : ''}`}
                aria-invalid={!!errors.pages}
                aria-describedby={errors.pages ? "pages-error" : undefined}
            >
            {PAGE_OPTIONS.map(page => (
                <Tooltip key={page.id} content={page.description}>
                    <div
                        onClick={() => handlePageSelect(page.id)}
                        role="checkbox"
                        aria-checked={formData.pages.includes(page.id)}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handlePageSelect(page.id); }}}
                        className={`relative flex flex-col items-center text-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary h-full ${
                            formData.pages.includes(page.id)
                                ? 'border-brand-primary bg-brand-primary/5'
                                : 'border-transparent bg-base-200 dark:bg-dark-300 hover:bg-base-300 dark:hover:bg-dark-100'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 mb-3 ${formData.pages.includes(page.id) ? 'text-brand-primary' : 'text-base-content-secondary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d={page.icon} />
                        </svg>

                        <span className="font-bold text-sm text-base-content dark:text-dark-content">{page.label}</span>
                        
                        {formData.pages.includes(page.id) && (
                            <div className="absolute top-3 right-3 bg-brand-primary rounded-full text-white flex items-center justify-center h-5 w-5 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                </Tooltip>
            ))}
            </div>
        </section>

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
                Generating Copy...
            </>
          ) : (
            <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1h12V3a1 1 0 00-1-1H5zM3 13a1 1 0 001 1h12a1 1 0 001-1V6H3v7z" clipRule="evenodd" />
                    <path d="M9.707 8.293a1 1 0 011.414 0l2 2a1 1 0 11-1.414 1.414L11 10.414V12a1 1 0 11-2 0v-1.586l-.293.293a1 1 0 01-1.414-1.414l2-2z" />
                </svg>
                Generate Website Copy
            </>
          )}
        </button>
      </form>
    </div>
  );
};
