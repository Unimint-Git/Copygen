
export type ToolId = 'website' | 'blog' | 'repurpose' | 'product' | 'image' | 'social' | 'grammar' | 'summarize';

// Website Copy Generator
export interface FormData {
  businessName: string;
  businessType: string;
  location: string;
  tone: string;
  details: string;
  pages: string[];
}

export interface GeneratedPage {
  page: string;
  title: string;
  content: string;
}

export interface GeneratedCopy {
  businessName: string;
  location: string;
  generatedPages: GeneratedPage[];
}

// Blog Post Generator
export interface BlogPostFormData {
  topic: string;
  keywords: string;
  tone: string;
}

export interface GeneratedBlogPost {
  title: string;
  content: string; // HTML content
}

// Content Repurposing Tool
export interface ContentRepurposingFormData {
  originalContent: string;
  targetFormat: string;
  tone: string;
}

export interface RepurposedContentItem {
  platform: string;
  content: string;
}

export interface GeneratedRepurposedContent {
  repurposedContent: RepurposedContentItem[];
}

// Product Description Generator
export interface ProductDescriptionFormData {
  productName: string;
  features: string;
  targetAudience: string;
  tone: string;
  format: 'paragraph' | 'bullets' | 'mixed';
}

export interface GeneratedProductDescription {
  productName: string;
  description: string; // HTML content
}

// Image Generator
export interface ImageGeneratorFormData {
  prompt: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
}

export interface GeneratedImage {
  imageUrl: string; // data:image/png;base64,...
}

// Social Media Post Generator
export interface SocialMediaPostFormData {
  topic: string;
  keywords: string;
  platform: string;
  tone: string;
}

export interface GeneratedSocialPost {
  postContent: string;
  hashtags: string[];
  platform?: string;
}

// Grammar Fixer
export interface GrammarFormData {
  text: string;
  tone: string;
}

export interface GeneratedGrammar {
  fixedText: string;
  corrections: string[];
}

// Summarizer
export interface SummarizeFormData {
  text: string;
  length: 'short' | 'medium' | 'long' | 'bullets';
}

export interface GeneratedSummary {
  summary: string;
  keyPoints: string[];
}


// Union types for generic handling
export type AllFormData = FormData | BlogPostFormData | ContentRepurposingFormData | ProductDescriptionFormData | ImageGeneratorFormData | SocialMediaPostFormData | GrammarFormData | SummarizeFormData;
export type GeneratedContent = GeneratedCopy | GeneratedBlogPost | GeneratedRepurposedContent | GeneratedProductDescription | GeneratedImage | GeneratedSocialPost | GeneratedGrammar | GeneratedSummary;

export interface HistoryItem {
  id: string;
  timestamp: number;
  tool: ToolId;
  content: GeneratedContent;
  label: string;
}
