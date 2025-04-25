import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI client with your API key
//const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI("AIzaSyACxqOVDRvhEEFTW-hkFJpKjOtrF1QBePA");
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Prompts for different types of analysis
const detailedReviewPrompt = `
You are an experienced HR professional with technical expertise. Analyze the resume text against the job description and provide a structured response in the following format:

1. OVERALL MATCH ASSESSMENT
   - Brief executive summary (2-3 sentences)

2. KEY STRENGTHS
   - List top 3-5 matching qualifications
   - Highlight relevant technical skills

3. EXPERIENCE ALIGNMENT
   - Relevant work experience
   - Project highlights
   - Technical achievements

4. AREAS FOR IMPROVEMENT
   - Missing required skills
   - Experience gaps
   - Certification recommendations

5. ACTIONABLE RECOMMENDATIONS
   - Specific steps to improve candidacy
   - Skill development priorities
   - Professional growth suggestions

Please maintain this exact structure in your response, using markdown formatting for better readability.
`;

const percentageMatchPrompt = `
You are an advanced ATS scanner. Analyze the resume text against the job description and provide a structured response in the following format:

1. MATCH SCORE
   - Overall percentage match
   - Breakdown by categories (Technical Skills, Experience, Education)

2. KEYWORD ANALYSIS
   - Matched keywords (✅)
   - Missing keywords (❌)
   - Partial matches (⚠️)

3. CORE COMPETENCIES
   - Strong matches (90-100%)
   - Moderate matches (60-89%)
   - Weak matches (below 60%)

4. QUICK RECOMMENDATIONS
   - Top 3 immediate actions to improve match

Please use markdown formatting and emojis for better visualization. Present statistics in a clear, tabular format where applicable.
`;

export type AnalysisType = 'detailed' | 'percentage';

export async function analyzeResume(
  resumeUrl: string,
  jobDescription: string,
  analysisType: AnalysisType
): Promise<string> {
  try {
    // Fetch and parse PDF
    const response1 = await fetch(resumeUrl);
    if (!response1.ok) {
      throw new Error(`Failed to fetch PDF: ${response1.statusText}`);
    }
    const pdfBlob = await response1.blob();
    const pdfText = await extractTextFromPdf(pdfBlob);

    // Select prompt based on analysis type
    const prompt = analysisType === 'detailed' ? detailedReviewPrompt : percentageMatchPrompt;

    // Prepare the full prompt
    const fullPrompt = `
Job Description:
---
${jobDescription}
---

Resume Text:
---
${pdfText}
---

Analysis Task:
---
${prompt}
---
`;

    // Call Gemini API
    const result = await model.generateContent(fullPrompt);
    const responsegemini = result.response;
    return responsegemini.text();
  } catch (error) {
    console.error('Error in ATS analysis:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze resume');
  }
}

async function extractTextFromPdf(pdfBlob: Blob): Promise<string> {
  try {
    // Convert blob to ArrayBuffer
    console.log("Extracting text from PDF...");
    const arrayBuffer = await pdfBlob.arrayBuffer();
    console.log("PDF extracted successfully.");
    
    // Use pdf.js to extract text
    const pdfjsLib = await import('pdfjs-dist');

    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    console.log("pdfjsLib version:", pdfjsLib.version);
    console.log(arrayBuffer);
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    console.log("Loading PDF...");
    const pdf = await loadingTask.promise;
    console.log("PDF loaded successfully.");
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    console.log("Text extracted successfully.");
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}