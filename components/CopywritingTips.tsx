
import React from 'react';
import { ToolId } from '../types';
import { COPYWRITING_TIPS } from '../constants';

interface CopywritingTipsProps {
    activeTool: ToolId;
}

export const CopywritingTips: React.FC<CopywritingTipsProps> = ({ activeTool }) => {
    const tips = COPYWRITING_TIPS[activeTool];

    if (!tips) return null;

    return (
        <div className="mt-6 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border border-brand-primary/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-5">
                <div className="bg-brand-primary/10 p-2 rounded-lg shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="font-bold text-lg text-base-content dark:text-dark-content">Copywriting Tips</h3>
            </div>
            <ul className="space-y-4">
                {tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-3 group">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white dark:bg-dark-300 border border-brand-primary/20 text-brand-primary text-xs font-bold flex items-center justify-center mt-0.5 shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-colors duration-200">
                            {index + 1}
                        </span>
                        <div>
                            <p className="text-sm font-bold text-base-content dark:text-dark-content mb-1">{tip.title}</p>
                            <p className="text-xs text-base-content-secondary dark:text-dark-content-secondary leading-relaxed">{tip.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
