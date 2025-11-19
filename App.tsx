
import React, { useState, useCallback, useEffect } from 'react';
import { CopyGeneratorForm } from './components/CopyGeneratorForm';
import { GeneratedContent } from './components/GeneratedContent';
import { Header } from './components/Header';
import { generateContent } from './services/geminiService';
import type { AllFormData, GeneratedContent as GeneratedContentType, ToolId, HistoryItem } from './types';
import { TOOLS } from './constants';
import { BlogPostGeneratorForm } from './components/BlogPostGeneratorForm';
import { ContentRepurposingForm } from './components/ContentRepurposingForm';
import { ProductDescriptionForm } from './components/ProductDescriptionForm';
import { ImageGeneratorForm } from './components/ImageGeneratorForm';
import { SocialMediaPostForm } from './components/SocialMediaPostForm';
import { GrammarFixerForm } from './components/GrammarFixerForm';
import { SummarizerForm } from './components/SummarizerForm';
import { Glossary } from './components/Glossary';
import { CopywritingTips } from './components/CopywritingTips';
import { HistoryDrawer } from './components/HistoryDrawer';
import { AuthModal } from './components/AuthModal';
import { PricingModal } from './components/PricingModal';
import { useUser } from './contexts/UserContext';

const AppContent: React.FC = () => {
  const { user, plan, credits, isAuthenticated, spendCredit } = useUser();
  
  const [activeTool, setActiveTool] = useState<ToolId>('website');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  const [tooltip, setTooltip] = useState<{text: string, rect: DOMRect} | null>(null);
  
  const [history, setHistory] = useState<HistoryItem[]>(() => {
      try {
          const saved = localStorage.getItem('copyGenHistory');
          return saved ? JSON.parse(saved) : [];
      } catch (e) {
          console.error("Failed to load history", e);
          return [];
      }
  });

  useEffect(() => {
      localStorage.setItem('copyGenHistory', JSON.stringify(history));
  }, [history]);

  const getHistoryLabel = (tool: ToolId, data: any): string => {
    switch(tool) {
        case 'website': return data.businessName || 'Website Copy';
        case 'blog': return data.topic || 'Blog Post';
        case 'social': return data.topic || 'Social Post';
        case 'product': return data.productName || 'Product Description';
        case 'image': return data.prompt || 'Generated Image';
        case 'repurpose': return 'Repurposed Content';
        case 'grammar': return 'Grammar Fix';
        case 'summarize': return 'Text Summary';
        default: return 'Generated Content';
    }
  };

  const addToHistory = (tool: ToolId, data: AllFormData, content: GeneratedContentType) => {
    const newItem: HistoryItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        tool,
        content,
        label: getHistoryLabel(tool, data)
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50)); // Limit to 50 items
  };

  const handleToolSelect = (toolId: ToolId) => {
      setActiveTool(toolId);
      setGeneratedContent(null);
      setError(null);
  }

  const handleFormSubmit = useCallback(async (formData: AllFormData) => {
    // 1. Authentication Check
    if (!isAuthenticated) {
        setIsAuthOpen(true);
        return;
    }

    // 2. Feature Access Check (Pro Tools)
    const currentTool = TOOLS.find(t => t.id === activeTool);
    if (currentTool?.isPro && plan !== 'pro') {
        setIsPricingOpen(true);
        return;
    }

    // 3. Credit Limit Check (for Free Plan)
    if (plan !== 'pro' && credits <= 0) {
        setIsPricingOpen(true);
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    try {
      const result = await generateContent(activeTool, formData);
      setGeneratedContent(result);
      addToHistory(activeTool, formData, result);
      spendCredit();
    } catch (err) {
      setError(err instanceof Error ? `Failed to generate content: ${err.message}. Please try again.` : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTool, isAuthenticated, plan, credits, spendCredit]);
  
  const handleClearContent = useCallback(() => {
    setGeneratedContent(null);
  }, []);

  const handleSelectHistoryItem = (item: HistoryItem) => {
      // Check permissions before restoring history of Pro tools
      const toolDef = TOOLS.find(t => t.id === item.tool);
      if (toolDef?.isPro && plan !== 'pro') {
          setIsPricingOpen(true);
          return;
      }

      setActiveTool(item.tool);
      setGeneratedContent(item.content);
      setIsHistoryOpen(false);
  };

  const handleDeleteHistoryItem = (id: string) => {
      setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleTooltipEnter = (e: React.MouseEvent, text: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ text, rect });
  };

  const handleTooltipLeave = () => {
    setTooltip(null);
  };

  const renderForm = () => {
    switch(activeTool) {
      case 'website':
        return <CopyGeneratorForm onSubmit={handleFormSubmit} isLoading={isLoading} />;
      case 'blog':
        return <BlogPostGeneratorForm onSubmit={handleFormSubmit} isLoading={isLoading} />;
      case 'repurpose':
        return <ContentRepurposingForm onSubmit={handleFormSubmit} isLoading={isLoading} />;
      case 'product':
        return <ProductDescriptionForm onSubmit={handleFormSubmit} isLoading={isLoading} />;
      case 'image':
        return <ImageGeneratorForm onSubmit={handleFormSubmit} isLoading={isLoading} />;
      case 'social':
        return <SocialMediaPostForm onSubmit={handleFormSubmit} isLoading={isLoading} />;
      case 'grammar':
        return <GrammarFixerForm onSubmit={handleFormSubmit} isLoading={isLoading} />;
      case 'summarize':
        return <SummarizerForm onSubmit={handleFormSubmit} isLoading={isLoading} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-base-200 dark:bg-dark-100 text-base-content dark:text-dark-content font-sans pb-12 relative">
      <Header 
        onOpenGlossary={() => setIsGlossaryOpen(true)} 
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          <div className="lg:sticky lg:top-8 h-fit">
            
            {/* Navigation Tabs */}
            <div className="mb-8">
                <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    <nav className="flex space-x-4 min-w-max" aria-label="Content Generation Tools" role="tablist">
                        {TOOLS.map((tool) => {
                            const isLocked = tool.isPro && plan !== 'pro';
                            const isActive = activeTool === tool.id;
                            
                            return (
                                <button
                                    key={tool.id}
                                    id={`tab-${tool.id}`}
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-controls={`panel-${tool.id}`}
                                    onClick={() => handleToolSelect(tool.id)}
                                    onMouseEnter={(e) => handleTooltipEnter(e, tool.description)}
                                    onMouseLeave={handleTooltipLeave}
                                    className={`
                                        group relative flex flex-col items-center justify-center py-3 px-5 rounded-2xl min-w-[110px] transition-all duration-300 border
                                        ${isActive 
                                            ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white border-transparent shadow-lg shadow-brand-primary/30 transform scale-105 z-10' 
                                            : 'bg-base-100 dark:bg-dark-200 text-base-content-secondary dark:text-dark-content-secondary border-base-200 dark:border-dark-300 hover:border-brand-primary/30 hover:bg-base-50 dark:hover:bg-dark-300 hover:shadow-md'
                                        }
                                    `}
                                >
                                    {/* Pro Badge */}
                                    {isLocked && (
                                        <div className="absolute top-2 right-2">
                                            <div className={`p-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-base-200 dark:bg-dark-400'}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className={`mb-2 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tool.icon} />
                                        </svg>
                                    </div>
                                    
                                    {/* Label */}
                                    <span className="text-xs font-bold whitespace-nowrap tracking-wide">
                                        {tool.label}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Active Form */}
            <div 
              id={`panel-${activeTool}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTool}`}
              className="bg-base-100 dark:bg-dark-200 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border border-base-200 dark:border-dark-300"
            >
              <div key={activeTool} className="animate-fade-in-up">
                {renderForm()}
              </div>
            </div>
            
            {/* Tips Section */}
            <CopywritingTips activeTool={activeTool} />
          </div>
          
          <div className="mt-8 lg:mt-0">
            <GeneratedContent 
              generatedContent={generatedContent}
              isLoading={isLoading}
              error={error}
              activeTool={activeTool}
              onClear={handleClearContent}
            />
          </div>
        </div>
      </main>
      
      <Glossary isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
      <HistoryDrawer 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
        onSelect={handleSelectHistoryItem}
        onDelete={handleDeleteHistoryItem}
      />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      
      {/* Floating Tooltip */}
      {tooltip && (
         <div 
            className="fixed z-[100] px-3 py-2 bg-dark-200/90 dark:bg-base-100/95 text-white dark:text-dark-100 text-xs font-medium rounded-lg shadow-xl backdrop-blur-sm pointer-events-none max-w-[200px] text-center animate-fade-in-up"
            role="tooltip"
            aria-hidden="true"
            style={{ 
                top: tooltip.rect.bottom + 10, 
                left: tooltip.rect.left + (tooltip.rect.width / 2), 
                transform: 'translateX(-50%)' 
            }}
         >
            {tooltip.text}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-dark-200/90 dark:bg-base-100/95 rotate-45"></div>
         </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
    return <AppContent />;
}

export default App;
