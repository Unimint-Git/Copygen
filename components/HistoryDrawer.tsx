
import React, { useEffect, useRef } from 'react';
import { HistoryItem, GeneratedImage } from '../types';
import { TOOLS } from '../constants';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, history, onSelect, onDelete }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';
        
        // Focus management
        setTimeout(() => {
            closeButtonRef.current?.focus();
        }, 100);
    }

    return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getToolIcon = (toolId: string) => {
      const tool = TOOLS.find(t => t.id === toolId);
      return tool ? tool.icon : '';
  };
  
  const getToolLabel = (toolId: string) => {
      const tool = TOOLS.find(t => t.id === toolId);
      return tool ? tool.label : toolId;
  }

  const formatDate = (timestamp: number) => {
      return new Intl.DateTimeFormat('en-US', {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(new Date(timestamp));
  };

  const stripHtml = (html: string) => {
      if (!html) return '';
      return html.replace(/<[^>]*>?/gm, '');
  };

  const getPreview = (item: HistoryItem) => {
      const content = item.content as any;
      if (!content) return '';

      switch (item.tool) {
          case 'website':
              if (content.generatedPages && content.generatedPages.length > 0) {
                  const firstPage = content.generatedPages[0];
                  return `${firstPage.title}: ${stripHtml(firstPage.content).substring(0, 120)}...`;
              }
              return stripHtml(JSON.stringify(content));
          case 'blog':
              return `${content.title}: ${stripHtml(content.content).substring(0, 120)}...`;
          case 'product':
              return `${content.productName}: ${stripHtml(content.description).substring(0, 120)}...`;
          case 'social':
              return `${(content.postContent || '').substring(0, 150)}...`;
          case 'repurpose':
              if (content.repurposedContent && content.repurposedContent.length > 0) {
                   return `${content.repurposedContent[0].platform}: ${content.repurposedContent[0].content.substring(0, 120)}...`;
              }
              return '';
          case 'image':
              return content.prompt || 'Generated Image';
          case 'grammar':
              return `${(content.fixedText || '').substring(0, 120)}...`;
          case 'summarize':
              return `${(content.summary || '').substring(0, 120)}...`;
          default:
              return 'Generated Content';
      }
  };

  return (
    <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true"></div>

      {/* Drawer */}
      <div 
          ref={drawerRef}
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-base-100 dark:bg-dark-200 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5 border-b border-base-300 dark:border-dark-300 flex justify-between items-center bg-base-200/50 dark:bg-dark-300/50">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-brand-primary/10 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <h2 id="history-title" className="text-lg font-bold text-base-content dark:text-dark-content">History</h2>
          </div>
          <button 
            ref={closeButtonRef}
            onClick={onClose} 
            className="p-2 hover:bg-base-300 dark:hover:bg-dark-100 rounded-full transition-colors text-base-content-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label="Close history"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center text-base-content-secondary dark:text-dark-content-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No history yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item) => {
                        const previewText = getPreview(item);
                        const isImage = item.tool === 'image';
                        const imageUrl = isImage ? (item.content as GeneratedImage).imageUrl : null;

                        return (
                            <div key={item.id} className="bg-base-100 dark:bg-dark-300 rounded-2xl p-4 hover:shadow-lg transition-all duration-200 group border-2 border-transparent hover:border-brand-primary/10 relative overflow-hidden">
                                {/* Header Row: Tool Badge & Date */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center space-x-2 text-xs font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getToolIcon(item.tool)} />
                                        </svg>
                                        <span>{getToolLabel(item.tool)}</span>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-wider font-semibold text-base-content-secondary/70 dark:text-dark-content-secondary/70">
                                        {formatDate(item.timestamp)}
                                    </span>
                                </div>

                                {/* Content: Title & Snippet/Image */}
                                <div className="mb-4">
                                    <h4 className="font-bold text-base text-base-content dark:text-dark-content mb-2 leading-tight">
                                        {item.label}
                                    </h4>
                                    
                                    {isImage && imageUrl ? (
                                        <div className="relative h-32 w-full rounded-xl overflow-hidden bg-base-200 dark:bg-dark-200">
                                            <img src={imageUrl} alt="History thumbnail" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <p className="text-sm text-base-content-secondary dark:text-dark-content-secondary line-clamp-3 leading-relaxed">
                                            {previewText || "No preview available."}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-base-200 dark:border-dark-200/50">
                                    <button 
                                        onClick={() => onSelect(item)}
                                        className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary hover:text-white py-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                        aria-label={`View ${item.label}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                        className="flex items-center justify-center p-2 text-base-content-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        title="Delete from history"
                                        aria-label={`Delete ${item.label} from history`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
