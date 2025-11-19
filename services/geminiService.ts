
import { GoogleGenAI, Type } from "@google/genai";
import type { 
    FormData, 
    GeneratedCopy, 
    ToolId,
    BlogPostFormData,
    GeneratedBlogPost,
    ContentRepurposingFormData,
    GeneratedRepurposedContent,
    ProductDescriptionFormData,
    GeneratedProductDescription,
    ImageGeneratorFormData,
    GeneratedImage,
    SocialMediaPostFormData,
    GeneratedSocialPost,
    GrammarFormData,
    GeneratedGrammar,
    SummarizeFormData,
    GeneratedSummary
} from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const callGemini = async (prompt: string, schema: any) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.8,
                topP: 0.95,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("The AI model failed to generate a valid response. This might be a temporary issue.");
    }
};


// 1. Website Copy Generator
const websiteCopySchema = {
  type: Type.OBJECT,
  properties: {
    businessName: { type: Type.STRING },
    location: { type: Type.STRING },
    generatedPages: {
      type: Type.ARRAY,
      description: "An array of generated content for each requested page.",
      items: {
        type: Type.OBJECT,
        properties: {
          page: { type: Type.STRING },
          title: { type: Type.STRING },
          content: { type: Type.STRING, description: "The full HTML-ready text content for the page, structured with headings (h2, h3) and paragraphs (p)." },
        },
        required: ['page', 'title', 'content'],
      },
    },
  },
  required: ['businessName', 'location', 'generatedPages'],
};
const buildWebsiteCopyPrompt = (formData: FormData): string => `
You are an expert website copywriter, SEO strategist, and brand voice specialist.
Generate professional website content for a local business based on the user's inputs.
Output valid HTML for the content, using tags like <h2>, <h3>, <p>, <ul>, and <li>.

### USER INPUTS:
- Business Name: ${formData.businessName}
- Business Type: ${formData.businessType}
- Location: ${formData.location}
- Style / Tone: ${formData.tone}
- Description / Extra Details: ${formData.details}
- Pages Requested: ${formData.pages.join(', ')}

### REQUIREMENTS:
1. **SEO Optimization**:
   - Naturally weave the primary keyword "${formData.businessType} in ${formData.location}" into the H1 and first paragraph of the Homepage.
   - Include variations of the location (e.g., "serving ${formData.location} and surrounding areas") to boost local search visibility.
   - Avoid keyword stuffing; keep it natural.

2. **Call to Action (CTA)**:
   - Every page must end with a compelling, action-oriented CTA (e.g., "Call us today at [Phone Number]", "Schedule your free consultation", "Visit us in ${formData.location}").
   - Use persuasive language that encourages immediate response.

3. **Content Structure & Tone**:
   - Adopt the "${formData.tone}" tone consistently.
   - Use <h2> and <h3> subheadings to break up text.
   - Use <ul> bullet points for features or services to improve readability.
   - Write short, punchy paragraphs.

4. **Output Format**:
   - Output ONLY the JSON object defined in the schema. Do not include markdown.`;

export const generateWebsiteCopy = async (formData: FormData): Promise<GeneratedCopy> => {
    const prompt = buildWebsiteCopyPrompt(formData);
    return callGemini(prompt, websiteCopySchema);
};

// 2. Blog Post Generator
const blogPostSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        content: { type: Type.STRING, description: "The full blog post content in HTML format, with headings, paragraphs, and lists." },
    },
    required: ['title', 'content'],
};
const generateBlogPost = async (formData: BlogPostFormData): Promise<GeneratedBlogPost> => {
    const prompt = `
Generate a high-quality blog post based on the following details.
The content should be well-structured, engaging, and ready to be published.
Output valid HTML for the content, using tags like <h2>, <h3>, <p>, <ul>, and <li>.

- Topic: ${formData.topic}
- Keywords to include: ${formData.keywords}
- Tone: ${formData.tone}

Structure the blog post with a catchy title, a brief introduction, several body paragraphs with clear subheadings, and a concluding paragraph.
Output ONLY the JSON object defined in the schema. Do not include markdown.`;
    return callGemini(prompt, blogPostSchema);
};

// 3. Content Repurposing Tool
const repurposeSchema = {
    type: Type.OBJECT,
    properties: {
        repurposedContent: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    platform: { type: Type.STRING },
                    content: { type: Type.STRING },
                },
                required: ['platform', 'content'],
            }
        }
    },
    required: ['repurposedContent']
};
const repurposeContent = async (formData: ContentRepurposingFormData): Promise<GeneratedRepurposedContent> => {
    const prompt = `
Repurpose the following original content into a new format.

- Original Content: "${formData.originalContent}"
- Target Format: ${formData.targetFormat}
- Tone: ${formData.tone}

Generate the content for the specified format, keeping the core message of the original text.
For a Tweet Thread, create multiple distinct tweets.
Output ONLY the JSON object defined in the schema. The 'platform' should be the name of the target format (e.g., 'Tweet 1', 'LinkedIn Post'). Do not include markdown.`;
    return callGemini(prompt, repurposeSchema);
};

// 4. Product Description Generator
const productDescriptionSchema = {
    type: Type.OBJECT,
    properties: {
        productName: { type: Type.STRING },
        description: { type: Type.STRING, description: "The full product description in HTML format." },
    },
    required: ['productName', 'description'],
};
const generateProductDescription = async (formData: ProductDescriptionFormData): Promise<GeneratedProductDescription> => {
    let formatInstruction = "";
    switch (formData.format) {
        case 'bullets':
            formatInstruction = "Format the description primarily as a scannable list of bullet points highlighting features and benefits, with a brief intro.";
            break;
        case 'paragraph':
            formatInstruction = "Format the description as engaging, well-written paragraphs that flow naturally.";
            break;
        case 'mixed':
            formatInstruction = "Start with an engaging hook paragraph to capture interest, followed by a bulleted list of key features/benefits, and end with a persuasive closing sentence.";
            break;
    }

    const prompt = `
Write a compelling product description for the following product.

### PRODUCT DETAILS
- Product Name: ${formData.productName}
- Target Audience: ${formData.targetAudience}
- Key Features / Details: ${formData.features}
- Tone / Style: ${formData.tone}

### INSTRUCTIONS
1. ${formatInstruction}
2. Speak directly to the target audience (${formData.targetAudience}).
3. Focus on benefits, not just features. Explain *why* it matters.
4. Adopt the requested tone ("${formData.tone}") throughout.
5. Output valid HTML using tags like <p>, <ul>, <li>, and <strong> for emphasis.

Output ONLY the JSON object defined in the schema. Do not include markdown.`;
    return callGemini(prompt, productDescriptionSchema);
};

// 5. Image Generator
const generateImage = async (formData: ImageGeneratorFormData): Promise<GeneratedImage> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: formData.prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: formData.aspectRatio,
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
        return { imageUrl };
    } catch (error) {
        console.error("Error calling Image Generation API:", error);
        throw new Error("The AI model failed to generate an image. Please check your prompt or try again.");
    }
};

// 6. Social Media Post Generator
const socialPostSchema = {
    type: Type.OBJECT,
    properties: {
        postContent: { type: Type.STRING, description: "The main text content of the social media post. Include emojis where appropriate." },
        hashtags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A list of 3-5 relevant hashtags (without the # symbol)."
        }
    },
    required: ['postContent', 'hashtags'],
};

const generateSocialPost = async (formData: SocialMediaPostFormData): Promise<GeneratedSocialPost> => {
    const prompt = `
Generate an engaging social media post for ${formData.platform}.

### DETAILS:
- Topic: ${formData.topic}
- Keywords: ${formData.keywords}
- Tone: ${formData.tone}

### REQUIREMENTS:
1. Tailor the length, style, and formatting to fit ${formData.platform} best practices.
2. Naturally incorporate the provided keywords.
3. Use an engaging hook to grab attention.
4. Use emojis to enhance the visual appeal (appropriate for the tone).
5. End with a relevant call to action or engagement question if suitable.
6. Generate 3-5 highly relevant hashtags.

Output ONLY the JSON object defined in the schema. Do not include markdown.`;

    const result = await callGemini(prompt, socialPostSchema);
    return {
        ...result,
        platform: formData.platform
    };
};

// 7. Grammar Fixer
const grammarSchema = {
    type: Type.OBJECT,
    properties: {
        fixedText: { type: Type.STRING, description: "The corrected text." },
        corrections: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of significant corrections made (e.g., 'Fixed subject-verb agreement', 'Corrected spelling of...')",
        }
    },
    required: ['fixedText', 'corrections'],
};

const generateGrammarFix = async (formData: GrammarFormData): Promise<GeneratedGrammar> => {
    const prompt = `
Check and fix the grammar, spelling, and punctuation of the following text.

### TEXT TO CHECK:
"${formData.text}"

### REQUIREMENTS:
1. Maintain the original meaning.
2. Adjust the tone to be "${formData.tone}".
3. Provide the fully corrected text.
4. List brief summaries of the key improvements made.

Output ONLY the JSON object defined in the schema. Do not include markdown.`;
    return callGemini(prompt, grammarSchema);
};

// 8. Summarizer
const summarySchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "The summarized text." },
        keyPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of key takeaways or bullet points extracted from the text.",
        }
    },
    required: ['summary', 'keyPoints'],
};

const generateSummary = async (formData: SummarizeFormData): Promise<GeneratedSummary> => {
    const lengthMap = {
        'short': '1-2 concise sentences',
        'medium': 'a single paragraph (3-5 sentences)',
        'long': 'a detailed summary covering all main sections',
        'bullets': 'a list of bullet points only'
    };

    const prompt = `
Summarize the following text.

### TEXT TO SUMMARIZE:
"${formData.text}"

### REQUIREMENTS:
1. Format the summary as: ${lengthMap[formData.length]}.
2. Extract the most important key points separately.
3. Be objective and accurate.

Output ONLY the JSON object defined in the schema. Do not include markdown.`;
    return callGemini(prompt, summarySchema);
};


// Master function
export const generateContent = async (tool: ToolId, formData: any): Promise<any> => {
    switch (tool) {
        case 'website':
            return generateWebsiteCopy(formData as FormData);
        case 'blog':
            return generateBlogPost(formData as BlogPostFormData);
        case 'repurpose':
            return repurposeContent(formData as ContentRepurposingFormData);
        case 'product':
            return generateProductDescription(formData as ProductDescriptionFormData);
        case 'image':
            return generateImage(formData as ImageGeneratorFormData);
        case 'social':
            return generateSocialPost(formData as SocialMediaPostFormData);
        case 'grammar':
            return generateGrammarFix(formData as GrammarFormData);
        case 'summarize':
            return generateSummary(formData as SummarizeFormData);
        default:
            throw new Error(`Unknown tool: ${tool}`);
    }
};
