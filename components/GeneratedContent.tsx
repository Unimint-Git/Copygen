
import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import type { GeneratedContent as GeneratedContentType, GeneratedCopy, GeneratedBlogPost, GeneratedRepurposedContent, GeneratedProductDescription, GeneratedImage, ToolId, GeneratedSocialPost, GeneratedGrammar, GeneratedSummary } from '../types';

// --- HELPER FUNCTIONS ---

const slugify = (text: string) => {
  if (!text) return 'download';
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '')
    .substring(0, 50);
};

const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const getPlainText = (content: GeneratedContentType, tool: ToolId): string => {
  switch (tool) {
    case 'website': return JSON.stringify(content, null, 2);
    case 'blog':
      const blog = content as GeneratedBlogPost;
      return `${blog.title}\n\n${blog.content.replace(/<[^>]+>/g, '\n').replace(/\n\n+/g, '\n')}`;
    case 'product':
      const product = content as GeneratedProductDescription;
      return `${product.productName}\n\n${product.description.replace(/<[^>]+>/g, '\n').replace(/\n\n+/g, '\n')}`;
    case 'repurpose':
      const repurposed = content as GeneratedRepurposedContent;
      return repurposed.repurposedContent.map(item => `--- ${item.platform} ---\n${item.content}`).join('\n\n');
    case 'social':
      const social = content as GeneratedSocialPost;
      return `${social.postContent}\n\n${social.hashtags.map(h => `#${h}`).join(' ')}`;
    case 'grammar':
        const grammar = content as GeneratedGrammar;
        return grammar.fixedText;
    case 'summarize':
        const summary = content as GeneratedSummary;
        return `${summary.summary}\n\nKey Points:\n${summary.keyPoints.map(p => `- ${p}`).join('\n')}`;
    default: return '';
  }
};

const getTitle = (content: GeneratedContentType, tool: ToolId): string => {
    switch (tool) {
        case 'website': return (content as GeneratedCopy).businessName;
        case 'blog': return (content as GeneratedBlogPost).title;
        case 'product': return (content as GeneratedProductDescription).productName;
        case 'repurpose': return 'repurposed-content';
        case 'image': return 'generated-image';
        case 'social': return 'social-media-post';
        case 'grammar': return 'grammar-check';
        case 'summarize': return 'summary';
        default: return 'generated-content';
    }
}

const getLoadingState = (tool: ToolId) => {
    switch (tool) {
        case 'website':
            return { title: "Generating Website Copy...", subtitle: "Crafting professional pages for your business." };
        case 'blog':
            return { title: "Writing Blog Post...", subtitle: "Drafting engaging content with SEO keywords." };
        case 'repurpose':
            return { title: "Repurposing Content...", subtitle: "Adapting your content for the new format." };
        case 'product':
            return { title: "Creating Product Description...", subtitle: "Highlighting features and benefits for your audience." };
        case 'image':
            return { title: "Generating Image...", subtitle: "Creating a visual masterpiece based on your prompt." };
        case 'social':
            return { title: "Writing Social Post...", subtitle: "Optimizing your post for maximum engagement." };
        case 'grammar':
            return { title: "Fixing Grammar...", subtitle: "Polishing your text to perfection." };
        case 'summarize':
            return { title: "Summarizing Text...", subtitle: "Extracting the key insights for you." };
        default:
            return { title: "Generating Content...", subtitle: "The AI is working its magic." };
    }
};

// --- UI COMPONENTS ---

const BrowserPreviewModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; content: string }> = ({ isOpen, onClose, title, content }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
             if (e.key === 'Escape') onClose();
        };
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if(isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = 'hidden';
            // Focus management
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 100);
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-title"
        >
            <div ref={modalRef} className="bg-white text-gray-900 rounded-xl shadow-2xl w-full max-w-5xl h-full md:h-[85vh] flex flex-col overflow-hidden animate-fade-in-up ring-1 ring-gray-200">
                {/* Browser Header */}
                <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center space-x-4 flex-shrink-0">
                    <div className="flex space-x-2" aria-hidden="true">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29]"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-2">
                        <div className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-xs text-gray-500 flex items-center w-full max-w-xl justify-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 opacity-50" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span className="truncate">https://example.com/blog/{slugify(title)}</span>
                        </div>
                    </div>
                    <button 
                        ref={closeButtonRef}
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1"
                        aria-label="Close preview"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {/* Browser Body */}
                <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
                    <div className="max-w-3xl mx-auto p-8 md:p-12">
                        <article className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-4xl prose-p:leading-relaxed prose-img:rounded-xl text-gray-800">
                            <h1 id="preview-title">{title}</h1>
                            <div dangerouslySetInnerHTML={{ __html: content }} />
                        </article>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClearButtonWithConfirmation: React.FC<{ onClear: () => void }> = ({ onClear }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowConfirm(false);
            }
        };
        if(showConfirm) {
            document.addEventListener("mousedown", handleClickOutside);
            // Focus the confirm button for safety
            setTimeout(() => {
                confirmButtonRef.current?.focus();
            }, 50);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showConfirm]);

    return (
        <>
            <button 
                onClick={() => setShowConfirm(true)} 
                className="p-3 rounded-full bg-base-100 dark:bg-dark-300 hover:bg-red-50 dark:hover:bg-red-900/20 text-base-content-secondary dark:text-dark-content-secondary hover:text-red-500 dark:hover:text-red-400 transition-colors shadow-sm group focus:outline-none focus:ring-2 focus:ring-red-500" 
                aria-label="Clear content"
                title="Clear content"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
            
            {showConfirm && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="clear-dialog-title"
                    aria-describedby="clear-dialog-description"
                >
                    <div ref={modalRef} className="bg-base-100 dark:bg-dark-200 rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 border border-base-300 dark:border-dark-300">
                        <div className="flex items-center space-x-3 mb-4 text-red-500">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 id="clear-dialog-title" className="text-lg font-bold text-base-content dark:text-dark-content">Clear Content?</h3>
                        </div>
                        <p id="clear-dialog-description" className="text-sm text-base-content-secondary dark:text-dark-content-secondary mb-6 leading-relaxed">
                            Are you sure you want to clear this content? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-base-content-secondary hover:bg-base-200 dark:hover:bg-dark-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                            >
                                Cancel
                            </button>
                            <button 
                                ref={confirmButtonRef}
                                onClick={() => { onClear(); setShowConfirm(false); }}
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
                            >
                                Yes, Clear It
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button onClick={handleCopy} className="p-3 rounded-full bg-base-100 dark:bg-dark-300 hover:bg-base-200 dark:hover:bg-dark-100 text-base-content-secondary dark:text-dark-content-secondary transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" aria-label="Copy content to clipboard" title="Copy to clipboard">
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
      )}
    </button>
  );
};

const ExportMenu: React.FC<{ content: GeneratedContentType, tool: ToolId, contentRef: React.RefObject<HTMLElement> }> = ({ content, tool, contentRef }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const title = getTitle(content, tool);
    const filename = slugify(title);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleExportPdf = async () => {
        if (!contentRef.current) return;
        setIsOpen(false);
        const canvas = await html2canvas(contentRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${filename}.pdf`);
    };

    const handleExportHtml = () => {
        const data = content as GeneratedBlogPost | GeneratedProductDescription;
        const html = 'content' in data ? data.content : data.description;
        const fullHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${title}</title><style>body{font-family:sans-serif;line-height:1.6;max-width:800px;margin:2rem auto;padding:0 1rem;}h1,h2,h3{color:#333;}</style></head><body><h1>${title}</h1>${html}</body></html>`;
        downloadFile(fullHtml, `${filename}.html`, 'text/html');
        setIsOpen(false);
    }
    
    const handleExportTxt = () => {
        downloadFile(getPlainText(content, tool), `${filename}.txt`, 'text/plain');
        setIsOpen(false);
    }

    const handleExportJson = () => {
        downloadFile(JSON.stringify(content, null, 2), `${filename}.json`, 'application/json');
        setIsOpen(false);
    }

    const handleDownloadImage = () => {
        const imageUrl = (content as GeneratedImage).imageUrl;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsOpen(false);
    };

    const handleExportWebsiteZip = async () => {
        const data = content as GeneratedCopy;
        // @ts-ignore
        const zip = new JSZip();
        
        data.generatedPages.forEach(page => {
            const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${page.title} - ${data.businessName}</title>
<style>
    body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #1f2937; }
    h1 { color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
    h2 { color: #111827; margin-top: 2rem; }
    p { margin-bottom: 1rem; }
    ul { padding-left: 1.5rem; margin-bottom: 1rem; }
    li { margin-bottom: 0.5rem; }
</style>
</head>
<body>
    <header>
        <p><strong>Business:</strong> ${data.businessName}</p>
        <p><strong>Page:</strong> ${page.page}</p>
    </header>
    <main>
        ${page.content}
    </main>
</body>
</html>`;
            zip.file(`${slugify(page.page)}.html`, htmlContent);
        });

        const blob = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${slugify(data.businessName)}-website-copy.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsOpen(false);
    };

    const handleExportWebsitePdf = () => {
        const data = content as GeneratedCopy;
        // @ts-ignore
        const doc = new jsPDF();
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxWidth = pageWidth - (margin * 2);
        
        doc.setFontSize(24);
        doc.setTextColor(79, 70, 229); // brand-primary
        doc.text(data.businessName, margin, 30);
        
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Location: ${data.location}`, margin, 40);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 46);
        
        let y = 60;

        data.generatedPages.forEach((page, index) => {
            if (index > 0) {
                doc.addPage();
                y = 30;
            } else {
                doc.setDrawColor(200);
                doc.line(margin, 50, pageWidth - margin, 50);
            }

            doc.setFontSize(18);
            doc.setTextColor(0);
            doc.text(page.title.toUpperCase(), margin, y);
            y += 10;
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Page: ${page.page}`, margin, y);
            y += 15;

            doc.setFontSize(12);
            doc.setTextColor(0);
            
            // Strip HTML tags for simple PDF text
            const plainText = page.content
                .replace(/<br\s*\/?>/gi, "\n")
                .replace(/<\/p>/gi, "\n\n")
                .replace(/<\/li>/gi, "\n")
                .replace(/<[^>]+>/g, "");
                
            const splitText = doc.splitTextToSize(plainText.trim(), maxWidth);
            doc.text(splitText, margin, y);
        });
        
        doc.save(`${slugify(data.businessName)}-copy.pdf`);
        setIsOpen(false);
    };

    const options = {
        'blog': [{ label: 'PDF', action: handleExportPdf }, { label: 'HTML', action: handleExportHtml }, { label: 'Text', action: handleExportTxt }],
        'product': [{ label: 'PDF', action: handleExportPdf }, { label: 'HTML', action: handleExportHtml }, { label: 'Text', action: handleExportTxt }],
        'repurpose': [{ label: 'Text', action: handleExportTxt }],
        'website': [
            { label: 'ZIP (HTML files)', action: handleExportWebsiteZip },
            { label: 'PDF', action: handleExportWebsitePdf },
            { label: 'JSON', action: handleExportJson }
        ],
        'image': [{ label: 'Download Image', action: handleDownloadImage }],
        'social': [{ label: 'Text', action: handleExportTxt }],
        'grammar': [{ label: 'Text', action: handleExportTxt }],
        'summarize': [{ label: 'Text', action: handleExportTxt }]
    }[tool] || [];

    if (options.length === 0) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-3 rounded-full bg-base-100 dark:bg-dark-300 hover:bg-base-200 dark:hover:bg-dark-100 text-base-content-secondary dark:text-dark-content-secondary transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" aria-label="Export options" aria-expanded={isOpen} title="Export options">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-base-100 dark:bg-dark-200 border border-base-300 dark:border-dark-300 rounded-xl shadow-xl z-10 overflow-hidden">
                    <ul className="py-1">
                        {options.map(opt => (
                            <li key={opt.label}>
                                <a href="#" onClick={(e) => { e.preventDefault(); opt.action(); }} className="block px-4 py-3 text-sm text-base-content dark:text-dark-content hover:bg-base-200 dark:hover:bg-dark-300 transition-colors">{`Download as ${opt.label}`}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const ActionToolbar: React.FC<{ 
    content: GeneratedContentType, 
    tool: ToolId, 
    contentRef: React.RefObject<HTMLElement>, 
    onClear: () => void,
    onPreview?: () => void
}> = ({ content, tool, contentRef, onClear, onPreview }) => (
    <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
        {onPreview && (
            <button 
                onClick={onPreview} 
                className="p-3 rounded-full bg-base-100 dark:bg-dark-300 hover:bg-base-200 dark:hover:bg-dark-100 text-base-content-secondary dark:text-dark-content-secondary transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                aria-label="Preview content in browser" 
                title="Preview in browser"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </button>
        )}
        <CopyButton textToCopy={getPlainText(content, tool)} />
        <ExportMenu content={content} tool={tool} contentRef={contentRef} />
        <ClearButtonWithConfirmation onClear={onClear} />
    </div>
);

const Placeholder = () => ( <div className="text-center p-12 border-2 border-dashed border-base-300 dark:border-dark-300 rounded-2xl h-full flex flex-col justify-center items-center bg-base-100/50 dark:bg-dark-200/50"><svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-300 dark:text-dark-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><h3 className="text-xl font-bold text-base-content dark:text-dark-content">Ready to Create</h3><p className="text-base text-base-content-secondary dark:text-dark-content-secondary mt-2 max-w-xs">Fill out the details on the left to generate high-quality content instantly.</p></div>);

const Loader: React.FC<{ tool: ToolId }> = ({ tool }) => {
    const { title, subtitle } = getLoadingState(tool);
    return (
        <div className="text-center p-12 border-2 border-dashed border-base-300 dark:border-dark-300 rounded-2xl h-full flex flex-col justify-center items-center bg-base-100/50 dark:bg-dark-200/50" role="status" aria-live="polite">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-brand-primary/20 rounded-full animate-ping"></div>
                <div className="relative bg-base-100 dark:bg-dark-200 p-4 rounded-full shadow-sm">
                    <svg className="animate-spin h-10 w-10 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
            <h3 className="text-xl font-bold text-base-content dark:text-dark-content animate-pulse">{title}</h3>
            <p className="text-base text-base-content-secondary dark:text-dark-content-secondary mt-2">{subtitle}</p>
        </div>
    );
};

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => ( <div className="p-6 border border-red-200 bg-red-50 dark:bg-red-900/10 rounded-2xl text-center" role="alert"><h3 className="text-lg font-bold text-red-700 dark:text-red-400">Generation Failed</h3><p className="text-sm text-red-600 dark:text-red-300 mt-2">{message}</p></div>);

const HtmlContentViewer = React.forwardRef<HTMLDivElement, { title: string; content: string }>(({ title, content }, ref) => (
  <article ref={ref} className="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-8 pt-16">
    <h1 className="mb-6">{title}</h1>
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </article>
));

const SocialPostPreview: React.FC<{ data: GeneratedSocialPost }> = ({ data }) => {
    const platform = data.platform?.toLowerCase() || '';
    const isTwitter = platform.includes('twitter') || platform.includes('x');
    const isLinkedIn = platform.includes('linkedin');
    const isInstagram = platform.includes('instagram');
    
    const Avatar = ({ className = "" }: { className?: string }) => (
        <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs flex-shrink-0 ${className}`} aria-hidden="true">
            LOGO
        </div>
    );

    const MediaPlaceholder = ({ height = "h-64", label = "Media Placeholder" }: { height?: string, label?: string }) => (
        <div className={`w-full ${height} bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 border border-gray-200 my-3`}>
            <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-xs uppercase tracking-wider font-medium">{label}</span>
        </div>
    );

    const VerifiedBadge = () => (
        <svg className="w-4 h-4 text-blue-500 ml-1" viewBox="0 0 24 24" fill="currentColor" aria-label="Verified account"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.457.73 2.745 1.843 3.46-.067.32-.102.65-.102.99 0 2.347 1.76 4.25 3.928 4.25.61 0 1.19-.142 1.71-.394.567 1.06 1.644 1.794 2.882 1.794s2.314-.734 2.88-1.794c.52.252 1.1.394 1.71.394 2.167 0 3.927-1.903 3.927-4.25 0-.34-.035-.67-.102-.99 1.114-.715 1.843-2.003 1.843-3.46zM10.007 16.75L6.174 12.918l2.05-2.05 1.783 1.782 4.86-4.86 2.05 2.05-6.91 6.91z" /></svg>
    );

    const TextContent = ({ textColor = "text-gray-900", hashtagColor = "text-blue-500" }) => (
        <div className={`whitespace-pre-wrap mb-2 text-[15px] leading-relaxed ${textColor}`}>
            {data.postContent}
            {data.hashtags && data.hashtags.length > 0 && (
                <div className={`mt-2 ${hashtagColor}`}>
                    {data.hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ')}
                </div>
            )}
        </div>
    );

    // Twitter Preview
    if (isTwitter) {
        return (
            <div className="bg-black text-white p-5 rounded-2xl max-w-md mx-auto font-sans border border-gray-800 shadow-xl">
                <div className="flex gap-3">
                    <Avatar className="bg-gray-700 text-gray-300" />
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1 flex-wrap">
                            <span className="font-bold text-[15px] text-white flex items-center">Your Brand <VerifiedBadge /></span>
                            <span className="text-gray-500 text-[15px]">@yourbrand</span>
                            <span className="text-gray-500 text-[15px]">· 1h</span>
                        </div>
                        <div className="mt-1">
                            <TextContent textColor="text-white" hashtagColor="text-[#1d9bf0]" />
                        </div>
                        <div className="flex justify-between text-gray-500 mt-4 max-w-[85%]">
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1d9bf0]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg><span className="text-xs">12</span></div>
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-green-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg><span className="text-xs">8</span></div>
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-pink-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg><span className="text-xs">48</span></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // LinkedIn Preview
    if (isLinkedIn) {
        return (
            <div className="bg-white text-black border border-gray-200 rounded-2xl max-w-md mx-auto font-sans shadow-lg overflow-hidden">
                <div className="p-4 flex gap-3 items-start">
                    <Avatar className="rounded-md" />
                    <div>
                        <div className="text-sm font-bold text-gray-900 leading-tight flex items-center">Your Brand <span className="text-gray-400 text-xs font-normal ml-1">• 1st</span></div>
                        <div className="text-xs text-gray-500 leading-tight mt-0.5">Industry Leader</div>
                        <div className="text-xs text-gray-500 leading-tight mt-0.5 flex items-center gap-1">1w • <svg className="w-3 h-3 text-gray-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg></div>
                    </div>
                </div>
                <div className="px-4 pb-2 text-sm text-gray-900">
                   <TextContent hashtagColor="text-blue-600 font-semibold" />
                </div>
                <div className="px-4 pb-2"><MediaPlaceholder height="h-60" /></div>
                <div className="p-2 flex justify-between px-4 border-t border-gray-100">
                    <div className="flex flex-col items-center gap-1 text-gray-500 hover:bg-gray-50 p-2 rounded-lg cursor-pointer flex-1"><span className="text-xs font-semibold text-gray-600">Like</span></div>
                    <div className="flex flex-col items-center gap-1 text-gray-500 hover:bg-gray-50 p-2 rounded-lg cursor-pointer flex-1"><span className="text-xs font-semibold text-gray-600">Comment</span></div>
                    <div className="flex flex-col items-center gap-1 text-gray-500 hover:bg-gray-50 p-2 rounded-lg cursor-pointer flex-1"><span className="text-xs font-semibold text-gray-600">Repost</span></div>
                    <div className="flex flex-col items-center gap-1 text-gray-500 hover:bg-gray-50 p-2 rounded-lg cursor-pointer flex-1"><span className="text-xs font-semibold text-gray-600">Send</span></div>
                </div>
            </div>
        );
    }

    // Instagram Preview
    if (isInstagram) {
        return (
            <div className="bg-white text-black border border-gray-200 rounded-2xl max-w-sm mx-auto font-sans shadow-xl overflow-hidden">
                <div className="p-3 flex justify-between items-center border-b border-gray-50">
                    <div className="flex gap-3 items-center">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]"><div className="w-full h-full rounded-full bg-white border-2 border-transparent overflow-hidden"><div className="w-full h-full bg-gray-200"></div></div></div>
                        <div className="text-sm font-semibold text-gray-900">yourbrand</div>
                    </div>
                    <div className="text-gray-900 font-bold cursor-pointer">...</div>
                </div>
                <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
                   <span className="text-xs uppercase font-medium tracking-widest">Image</span>
                </div>
                <div className="p-3">
                    <div className="flex justify-between mb-3">
                         <div className="flex gap-4">
                            <svg className="w-6 h-6 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            <svg className="w-6 h-6 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            <svg className="w-6 h-6 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                         </div>
                    </div>
                    <div className="text-sm">
                        <span className="font-bold mr-2">yourbrand</span>
                        <TextContent hashtagColor="text-blue-900" />
                    </div>
                </div>
            </div>
        );
    }

    // Facebook / Default Preview
    return (
        <div className="bg-white text-black border border-gray-200 rounded-2xl max-w-md mx-auto font-sans shadow-lg overflow-hidden">
            <div className="p-4 flex gap-3 items-center">
                <Avatar className="bg-blue-600 text-white" />
                <div>
                    <div className="text-sm font-bold text-gray-900">Your Brand</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">Just now · <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 18z" clipRule="evenodd" /></svg></div>
                </div>
            </div>
            <div className="px-4 pb-3 text-sm text-gray-900 font-normal">
                <TextContent hashtagColor="text-blue-600" />
            </div>
            <div className="mb-2"><MediaPlaceholder label="Photo / Video" /></div>
            <div className="p-2 flex justify-between px-2 mx-2 border-t border-gray-100 text-gray-500">
                 <div className="flex items-center justify-center gap-2 font-semibold text-sm hover:bg-gray-100 flex-1 py-2 rounded-lg cursor-pointer">Like</div>
                 <div className="flex items-center justify-center gap-2 font-semibold text-sm hover:bg-gray-100 flex-1 py-2 rounded-lg cursor-pointer">Comment</div>
                 <div className="flex items-center justify-center gap-2 font-semibold text-sm hover:bg-gray-100 flex-1 py-2 rounded-lg cursor-pointer">Share</div>
            </div>
        </div>
    );
};

// --- MAIN RENDERER ---

const ContentRenderer: React.FC<{ content: GeneratedContentType, tool: ToolId, onClear: () => void }> = ({ content, tool, onClear }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    
    // Determine if this tool supports preview
    const supportsPreview = tool === 'blog' || tool === 'product';
    const handlePreview = supportsPreview ? () => setIsPreviewOpen(true) : undefined;

    // For modal
    let previewTitle = '';
    let previewContent = '';

    if (supportsPreview) {
        const data = content as GeneratedBlogPost | GeneratedProductDescription;
        previewTitle = 'title' in data ? data.title : data.productName;
        previewContent = 'content' in data ? data.content : data.description;
    }
    
    switch(tool) {
        case 'website':
            return (
                <div className="bg-dark-200 dark:bg-dark-300 rounded-2xl shadow-lg relative overflow-hidden">
                    <ActionToolbar content={content} tool={tool} contentRef={contentRef} onClear={onClear} />
                    <pre ref={contentRef as any} className="p-8 pt-16 text-sm text-dark-content bg-transparent overflow-x-auto custom-scrollbar">
                        <code>{JSON.stringify(content, null, 2)}</code>
                    </pre>
                </div>
            )
        case 'blog':
        case 'product':
            const data = content as GeneratedBlogPost | GeneratedProductDescription;
            const title = 'title' in data ? data.title : data.productName;
            const htmlContent = 'content' in data ? data.content : data.description;
            return (
                <>
                    <div className="bg-base-100 dark:bg-dark-200 rounded-2xl shadow-lg relative overflow-hidden">
                        <ActionToolbar content={content} tool={tool} contentRef={contentRef} onClear={onClear} onPreview={handlePreview} />
                        <HtmlContentViewer ref={contentRef} title={title} content={htmlContent} />
                    </div>
                    <BrowserPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title={previewTitle} content={previewContent} />
                </>
            )
        case 'repurpose':
            const repurposedData = content as GeneratedRepurposedContent;
            return (
                <div className="space-y-6">
                    {repurposedData.repurposedContent.map((item, index) => (
                        <div key={index} className="bg-base-100 dark:bg-dark-200 p-6 rounded-2xl shadow-md relative">
                            <ActionToolbar content={content} tool={tool} contentRef={contentRef} onClear={onClear} />
                            <h4 className="font-bold text-lg text-brand-primary mb-3">{item.platform}</h4>
                            <div className="text-base text-base-content dark:text-dark-content whitespace-pre-wrap leading-relaxed">{item.content}</div>
                        </div>
                    ))}
                </div>
            )
        case 'image':
            const imageData = content as GeneratedImage;
            return (
                <div className="bg-base-100 dark:bg-dark-200 p-6 rounded-2xl shadow-lg relative">
                    <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
                        <ExportMenu content={content} tool={tool} contentRef={contentRef} />
                        <ClearButtonWithConfirmation onClear={onClear} />
                    </div>
                    <img src={imageData.imageUrl} alt="Generated by AI" className="rounded-xl w-full shadow-md" ref={contentRef as any} />
                </div>
            )
        case 'social':
            const socialData = content as GeneratedSocialPost;
            return (
                <div className="bg-base-100 dark:bg-dark-200 p-6 rounded-2xl shadow-lg relative" ref={contentRef as any}>
                    <ActionToolbar content={content} tool={tool} contentRef={contentRef} onClear={onClear} />
                    <h3 className="text-xl font-bold text-base-content dark:text-dark-content mb-8 px-2">Post Preview</h3>
                    <SocialPostPreview data={socialData} />
                </div>
            );
        case 'grammar':
            const grammarData = content as GeneratedGrammar;
            return (
                <div className="bg-base-100 dark:bg-dark-200 p-6 rounded-2xl shadow-lg relative" ref={contentRef as any}>
                    <ActionToolbar content={content} tool={tool} contentRef={contentRef} onClear={onClear} />
                    <div className="space-y-6 pt-8">
                        <div>
                            <h4 className="text-sm font-bold text-base-content-secondary uppercase tracking-wider mb-2">Corrected Text</h4>
                            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl text-base-content dark:text-dark-content whitespace-pre-wrap leading-relaxed">
                                {grammarData.fixedText}
                            </div>
                        </div>
                        {grammarData.corrections && grammarData.corrections.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-base-content-secondary uppercase tracking-wider mb-2">Changes Made</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-base-content dark:text-dark-content bg-base-200/50 dark:bg-dark-300/30 p-4 rounded-xl">
                                    {grammarData.corrections.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            );
        case 'summarize':
            const summaryData = content as GeneratedSummary;
            return (
                <div className="bg-base-100 dark:bg-dark-200 p-6 rounded-2xl shadow-lg relative" ref={contentRef as any}>
                    <ActionToolbar content={content} tool={tool} contentRef={contentRef} onClear={onClear} />
                    <div className="space-y-6 pt-8">
                        <div>
                            <h4 className="text-sm font-bold text-base-content-secondary uppercase tracking-wider mb-2">Summary</h4>
                            <div className="text-lg text-base-content dark:text-dark-content leading-relaxed">
                                {summaryData.summary}
                            </div>
                        </div>
                        {summaryData.keyPoints && summaryData.keyPoints.length > 0 && (
                            <div className="bg-base-200/50 dark:bg-dark-300/30 p-5 rounded-xl">
                                <h4 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-3">Key Takeaways</h4>
                                <ul className="space-y-2">
                                    {summaryData.keyPoints.map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-base-content dark:text-dark-content">
                                            <span className="text-brand-primary mt-1.5">•</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            );
        default: return <p>Unsupported content type.</p>
    }
}

interface GeneratedContentProps {
  generatedContent: GeneratedContentType | null;
  isLoading: boolean;
  error: string | null;
  activeTool: ToolId;
  onClear: () => void;
}

export const GeneratedContent: React.FC<GeneratedContentProps> = ({ generatedContent, isLoading, error, activeTool, onClear }) => {
    if (isLoading) return <Loader tool={activeTool} />;
    if (error) return <ErrorDisplay message={error} />;
    if (!generatedContent) return <Placeholder />;

    return <ContentRenderer content={generatedContent} tool={activeTool} onClear={onClear} />;
};
