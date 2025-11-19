
import { ToolId } from "./types";

export const TONES = [
  { name: "Professional", description: "Clear, formal, and objective for a corporate audience." },
  { name: "Friendly & Casual", description: "Warm, conversational, and approachable for a relaxed vibe." },
  { name: "Luxury & High-End", description: "Elegant, sophisticated, and aspirational for premium brands." },
  { name: "Playful & Fun", description: "Energetic, humorous, and entertaining to engage and delight." },
  { name: "Trustworthy & Formal", description: "Authoritative, serious, and respectful for serious matters." },
  { name: "Modern & Techy", description: "Innovative, sleek, and forward-thinking for tech content." },
  { name: "Minimalist & Clean", description: "Simple, direct, and uncluttered for a modern aesthetic." },
  { name: "Persuasive & Sales-Oriented", description: "Compelling, benefit-focused, and action-driven for marketing." },
  { name: "Informative & Educational", description: "Knowledgeable, helpful, and insightful for expert content." },
];

export const PAGE_OPTIONS = [
  { 
    id: 'homepage', 
    label: 'Homepage',
    description: 'The main entry point for your website.',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  { 
    id: 'about', 
    label: 'About Page',
    description: 'Share your story, mission, and team.',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  { 
    id: 'services', 
    label: 'Services Page',
    description: 'List and detail all the services you offer.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  },
  { 
    id: 'single_service', 
    label: 'Single Service Page',
    description: 'A focused page for one specific service.',
    icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
  },
  { 
    id: 'testimonials',
    label: 'Testimonials Page',
    description: 'Showcase customer reviews and success stories.',
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
  },
  { 
    id: 'faq',
    label: 'FAQ Page',
    description: 'Answer common questions to build trust.',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  { 
    id: 'portfolio',
    label: 'Portfolio Page',
    description: 'Display your best work and case studies.',
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
  },
  { 
    id: 'seo_local', 
    label: 'SEO Local Page',
    description: 'Target customers in a specific city or area.',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z'
  },
  { 
    id: 'gmb_description', 
    label: 'Google Business Profile',
    description: 'Optimized text for your GMB listing.',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
  },
  { 
    id: 'contact', 
    label: 'Contact Page',
    description: 'Help customers get in touch easily.',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
];

export const TOOLS: { id: ToolId; label: string; icon: string; description: string; isPro?: boolean }[] = [
    { 
        id: 'website', 
        label: 'Website Copy', 
        icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
        description: 'Generate comprehensive website content including homepages, about pages, and services.',
        isPro: false
    },
    { 
        id: 'blog', 
        label: 'Blog Post', 
        icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
        description: 'Create engaging, SEO-friendly blog posts formatted with proper headings.',
        isPro: false
    },
    { 
        id: 'social', 
        label: 'Social Media', 
        icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
        description: 'Craft catchy posts tailored for LinkedIn, Twitter, Instagram, and Facebook.',
        isPro: false
    },
    { 
        id: 'grammar', 
        label: 'Grammar Fix', 
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        description: 'Fix grammar, spelling, and punctuation errors instantly.',
        isPro: false
    },
    { 
        id: 'summarize', 
        label: 'Summarizer', 
        icon: 'M4 6h16M4 12h16M4 18h7',
        description: 'Summarize long text into concise paragraphs or bullet points.',
        isPro: true
    },
    { 
        id: 'repurpose', 
        label: 'Repurpose', 
        icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
        description: 'Transform existing content into new formats like tweets, emails, or summaries.',
        isPro: true
    },
    { 
        id: 'product', 
        label: 'Product', 
        icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
        description: 'Write persuasive product descriptions that highlight features and benefits.',
        isPro: true
    },
    { 
        id: 'image', 
        label: 'Image', 
        icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
        description: 'Generate high-quality, custom AI images based on your text prompts.',
        isPro: true
    },
];

export const REPURPOSE_FORMATS = [
    "Tweet Thread (5 Tweets)",
    "LinkedIn Post",
    "Facebook Post",
    "Email Newsletter",
    "Key Takeaways Summary"
];

export const SOCIAL_PLATFORMS = [
    { id: 'linkedin', name: 'LinkedIn', description: 'Professional, insightful, longer form.' },
    { id: 'twitter', name: 'Twitter / X', description: 'Short, punchy, trending hashtags.' },
    { id: 'instagram', name: 'Instagram', description: 'Visual, engaging caption, emojis.' },
    { id: 'facebook', name: 'Facebook', description: 'Conversational, community-focused.' },
];

export const COPYWRITING_TIPS: Record<ToolId, { title: string; description: string }[]> = {
    website: [
        { title: "Focus on the Customer", description: "Use 'you' more than 'we'. Address their pain points directly." },
        { title: "Clear Value Proposition", description: "Explain what you do and why it matters within the first 5 seconds." },
        { title: "Strong Call to Action", description: "Tell visitors exactly what step to take next (e.g., 'Get a Quote')." }
    ],
    blog: [
        { title: "Craft a Magnetic Headline", description: "80% of people will read your headline, but only 20% will read the rest." },
        { title: "Make it Scannable", description: "Use short paragraphs, subheadings, and bullet points to keep readers engaged." },
        { title: "Solve a Problem", description: "Ensure the post provides a tangible solution or insight for the reader." }
    ],
    repurpose: [
        { title: "Match the Platform", description: "Adjust the tone: LinkedIn is professional, Twitter/X is punchy and conversational." },
        { title: "Simplify", description: "When turning a blog into a social post, focus on one key takeaway." },
        { title: "Hook Immediately", description: "Start with the most surprising or valuable insight." }
    ],
    product: [
        { title: "Benefits over Features", description: "Don't just say 'leather seats' (feature); say 'easy to clean and luxurious' (benefit)." },
        { title: "Sensory Language", description: "Use words that evoke touch, sight, or feeling to help them imagine owning it." },
        { title: "Overcome Objections", description: "Address potential concerns (e.g., sizing, warranty) proactively." }
    ],
    image: [
        { title: "Be Specific", description: "Include details about lighting (e.g., 'golden hour'), style (e.g., 'minimalist'), and mood." },
        { title: "Define the Medium", description: "Specify if it's a 'photograph', '3D render', 'oil painting', or 'vector illustration'." },
        { title: "Composition Matters", description: "Mention angles like 'wide shot', 'close-up', or 'bird's-eye view'." }
    ],
    social: [
        { title: "Stop the Scroll", description: "Your first sentence must be attention-grabbing or controversial." },
        { title: "Encourage Engagement", description: "End with a specific question to prompt comments." },
        { title: "Use White Space", description: "Break up text with line breaks to make it easy to read on mobile." }
    ],
    grammar: [
        { title: "Keep it Simple", description: "Avoid overly complex words where a simple one will do." },
        { title: "Active Voice", description: "Use active voice (e.g., 'He threw the ball') for clarity and impact." },
        { title: "Read Aloud", description: "Reading your text aloud helps identify awkward phrasing." }
    ],
    summarize: [
        { title: "Identify the Core Message", description: "Focus on the main argument or point of the text." },
        { title: "Remove Fluff", description: "Eliminate adjectives and adverbs that don't add essential meaning." },
        { title: "Use Bullets", description: "Bullet points make summaries easier to scan and digest." }
    ]
};
