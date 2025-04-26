import { GoogleGenerativeAI } from "@google/generative-ai";
// Import pdfjs and worker directly
import * as pdfjs from "pdfjs-dist";

// Set worker properly (this is crucial for Vite-based projects)
if (typeof window !== "undefined" && "Worker" in window) {
  pdfjs.GlobalWorkerOptions.workerPort = new Worker(
    new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url),
    { type: "module" }
  );
}

// Initialize Google Generative AI client with your API key
//const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI("AIzaSyACxqOVDRvhEEFTW-hkFJpKjOtrF1QBePA");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

export type AnalysisType = "detailed" | "percentage";

export async function analyzeResume(
  resumeUrl: string,
  jobDescription: string,
  analysisType: AnalysisType
): Promise<string> {
  try {
    // Download and extract text from PDF
    const pdfText = await downloadAndProcessPdf(resumeUrl);

    // Log the extracted text (or error message) before sending to Gemini
    console.log(
      "Text being sent to Gemini (first 500 chars):",
      pdfText.substring(0, 500)
    );
    if (
      pdfText.startsWith("Failed to process PDF") ||
      pdfText.startsWith("The PDF could not be processed")
    ) {
      console.error("PDF processing failed, returning error message.");
      // Optionally, return a user-friendly error instead of sending to Gemini
      // return "Error: Could not process the resume PDF.";
      // Or let Gemini try to analyze the error message (as currently happens)
    }

    // Select prompt based on analysis type
    const prompt =
      analysisType === "detailed"
        ? detailedReviewPrompt
        : percentageMatchPrompt;

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
    console.log("Sending request to Gemini API...");
    const result = await model.generateContent(fullPrompt);
    const responsegemini = result.response;
    console.log("Received response from Gemini API.");
    return responsegemini.text();
  } catch (error) {
    console.error("Error in ATS analysis:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to analyze resume"
    );
  }
}

async function downloadAndProcessPdf(url: string): Promise<string> {
  console.log("Downloading PDF from:", url);
  try {
    // Download the PDF with proper error handling
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to download PDF: ${response.status} ${response.statusText}`
      );
    }

    const pdfBlob = await response.blob();
    console.log("PDF downloaded successfully, size:", pdfBlob.size, "bytes");

    // Extract text using improved method
    const extractedText = await extractTextFromPdfSimple(pdfBlob);

    if (!extractedText || extractedText.trim().length < 50) {
      console.warn(
        "Extracted text is too short or empty. Possible extraction failure."
      );
      return "The PDF could not be processed correctly. It may be scanned, protected, or contain only images.";
    }

    console.log(
      "PDF text extracted successfully, length:",
      extractedText.length
    );
    return extractedText;
  } catch (error) {
    console.error("Error processing PDF:", error);
    return `Failed to process PDF: ${error instanceof Error ? error.message : String(error)}. Please check if the URL is valid and accessible.`;
  }
}

async function extractTextFromPdfSimple(pdfBlob: Blob): Promise<string> {
  console.log("Extracting text from PDF...");
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();

    // We're now using the directly imported pdfjs instead of dynamic import
    console.log("Using PDF.js version:", pdfjs.version);

    // Load document with better error handling
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: true,
      useSystemFonts: true,
    });

    // Add progress logging
    loadingTask.onProgress = (data: any) => {
      if (data.total > 0) {
        console.log(
          `Loading PDF: ${Math.round((100 * data.loaded) / data.total)}%`
        );
      }
    };

    console.log("Loading PDF document...");
    const pdf = (await Promise.race([
      loadingTask.promise,
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("PDF loading timeout after 30s")),
          30000
        )
      ),
    ])) as any; // Keep 'as any' for now, assuming pdfjs types might be complex

    console.log(`PDF loaded with ${pdf.numPages} pages`);

    // Extract text page by page with better error handling
    const pagePromises = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      pagePromises.push(
        (async (pageNum) => {
          try {
            console.log(`Processing page ${pageNum}/${pdf.numPages}`);
            const page = await pdf.getPage(pageNum);
            // Add timeout for text extraction per page
            const textContent = await Promise.race([
              page.getTextContent(),
              new Promise(
                (_, reject) =>
                  setTimeout(
                    () =>
                      reject(
                        new Error(
                          `Timeout extracting text from page ${pageNum}`
                        )
                      ),
                    10000
                  ) // 10s timeout per page
              ),
            ]); // Using 'as any' for simplicity with TextContent type

            // More robust filtering and joining
            if (textContent && Array.isArray(textContent.items)) {
              return textContent.items
                .map((item: any) =>
                  item && typeof item.str === "string" ? item.str : ""
                )
                .join(" ") // Join items with spaces within a page
                .replace(/\s+/g, " ") // Normalize whitespace
                .trim();
            }
            console.warn(`No text items found for page ${pageNum}`);
            return ""; // Return empty string if no items
          } catch (pageError) {
            console.warn(
              `Error extracting text from page ${pageNum}:`,
              pageError instanceof Error ? pageError.message : pageError
            );
            // Return a marker, but maybe less disruptive than a full error message
            return `[Page ${pageNum} Extraction Error]`;
          }
        })(i)
      );
    }

    // Process pages in parallel for better performance
    const pageTexts = await Promise.all(pagePromises);
    // Join page texts with double newlines
    const fullText = pageTexts
      .filter((text) => text && text.length > 0)
      .join("\n\n");

    console.log("Raw extracted text length:", fullText.length);
    return fullText.trim();
  } catch (error) {
    console.error("Fatal error extracting text from PDF:", error);
    throw new Error(
      `PDF text extraction failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
