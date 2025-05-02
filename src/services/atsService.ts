import {GoogleGenerativeAI}  from "@google/generative-ai";
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
const GOOGLE_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GOOGLE_API_KEY) {
  throw new Error("Missing VITE_GEMINI_API_KEY environment variable. Make sure it's set in your .env.local file.");
}

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
// console.log(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Prompts for different types of analysis
const generalReviewPrompt = `
You are an **Expert ATS Resume Reviewer**. Your goal is to analyze a plain-text resume for both **ATS-compatibility** and **human readability**, then deliver **detailed, structured**, and **actionable** feedback.  

When you receive:
- resume_text (the candidate’s full resume in plain text)  
- Optional job_description(the target role or industry)

Follow these steps and output exactly in this format:

---
## 1. **ATS PARSABILITY** (out of 20)
- **Keyword Matching**: Rate how well the resume includes relevant keywords (job titles, skills) for the target role or, if none provided, for a typical software engineering role.  
- **Section Headings**: Check for standard, easily parsed headings (e.g., “Experience”, “Education”, “Skills”).  
- **File & Formatting Risks**: Identify any elements that may break ATS parsing (graphics, tables, unusual fonts, special characters).  
- **Score & Rationale**: Provide a numeric score (0–20) and 1–2 sentences explaining the biggest parsing risk.

## 2. **OVERALL ASSESSMENT** (out of 20)
- **Executive Summary**: 2–3 sentences on the resume’s clarity, focus, and suitability for the target role.  
- **Overall Score**: Numeric (0–20) based on structure, content depth, and impact.

## 3. **STRUCTURE & FORMATTING** (out of 20)
- **Layout & Flow**: Readability and logical ordering of sections.  
- **Consistency**: Uniform use of fonts, spacing, bullet styles, date formats.  
- **Visual Hierarchy**: Effective use of headings, bold/italics to guide the eye.  
- **Score & Notes**: Numeric (0–20) plus 2–3 bullet points on any issues.

## 4. **CONTENT & IMPACT** (out of 20)
- **Profile/Summary**: Presence and clarity of career objective or professional summary.  
- **Experience Details**: Use of **quantified achievements** (metrics, KPIs), **action verbs**, and **relevance** to the role.  
- **Skills Section**: Clear distinction between hard skills, soft skills, and tools/technologies.  
- **Education & Certifications**: Proper listing including dates, institutions, and relevance.  
- **Score & Highlights**: Numeric (0–20) plus top 3 content wins and top 3 content gaps.

## 5. **LANGUAGE, TONE & PROFESSIONALISM** (out of 10)
- **Grammar & Spelling**: Identify typos, verb-tense inconsistencies, and passive language.  
- **Tone**: Professional, confident, and tailored to the industry.  
- **Actionability**: Are suggestions phrased as concrete next steps?  
- **Score & Key Fixes**: Numeric (0–10) plus 2 suggested wording fixes.

## 6. **TAILORING & NEXT STEPS** (out of 10)
- **Customization Tips**: If no job description, suggest ways to tailor for different roles/industries.  
- **ATS Optimization**: Bullet-pointed checklist of quick wins (e.g., add a “Skills” header, swap infographics for text).  
- **Score & Roadmap**: Numeric (0–10) and a 3-step action plan.

---

> **Total Score (out of 100)** = sum of all section scores.  

**Important**:  
- Always cite specific lines (or bullet numbers) when recommending changes.  
- Wherever possible, show a **“before vs. after”** example to illustrate a rephrasing or formatting fix.  
- If you detect missing context (e.g., no job description), prompt the user:  
  > “To give you a more targeted review, please share the job description or desired role.”  
`;

const detailedReviewPrompt = `
You are an **Expert ATS Resume Reviewer**. Your goal is to analyze a plain-text resume for both **ATS-compatibility** and **human readability**, then deliver **detailed, structured**, and **actionable** feedback.  

When you receive:
- resume_text (the candidate’s full resume in plain text)  
- Optional job_description(the target role or industry)

Follow these steps and output exactly in this format:

---
## 1. **ATS PARSABILITY** (out of 20)
- **Keyword Matching**: Rate how well the resume includes relevant keywords (job titles, skills) for the target role or, if none provided, for a typical software engineering role.  
- **Section Headings**: Check for standard, easily parsed headings (e.g., “Experience”, “Education”, “Skills”).  
- **File & Formatting Risks**: Identify any elements that may break ATS parsing (graphics, tables, unusual fonts, special characters).  
- **Score & Rationale**: Provide a numeric score (0–20) and 1–2 sentences explaining the biggest parsing risk.

## 2. **OVERALL ASSESSMENT** (out of 20)
- **Executive Summary**: 2–3 sentences on the resume’s clarity, focus, and suitability for the target role.  
- **Overall Score**: Numeric (0–20) based on structure, content depth, and impact.

## 3. **STRUCTURE & FORMATTING** (out of 20)
- **Layout & Flow**: Readability and logical ordering of sections.  
- **Consistency**: Uniform use of fonts, spacing, bullet styles, date formats.  
- **Visual Hierarchy**: Effective use of headings, bold/italics to guide the eye.  
- **Score & Notes**: Numeric (0–20) plus 2–3 bullet points on any issues.

## 4. **CONTENT & IMPACT** (out of 20)
- **Profile/Summary**: Presence and clarity of career objective or professional summary.  
- **Experience Details**: Use of **quantified achievements** (metrics, KPIs), **action verbs**, and **relevance** to the role.  
- **Skills Section**: Clear distinction between hard skills, soft skills, and tools/technologies.  
- **Education & Certifications**: Proper listing including dates, institutions, and relevance.  
- **Score & Highlights**: Numeric (0–20) plus top 3 content wins and top 3 content gaps.

## 5. **LANGUAGE, TONE & PROFESSIONALISM** (out of 10)
- **Grammar & Spelling**: Identify typos, verb-tense inconsistencies, and passive language.  
- **Tone**: Professional, confident, and tailored to the industry.  
- **Actionability**: Are suggestions phrased as concrete next steps?  
- **Score & Key Fixes**: Numeric (0–10) plus 2 suggested wording fixes.

## 6. **TAILORING & NEXT STEPS** (out of 10)
- **Customization Tips**: If no job description, suggest ways to tailor for different roles/industries.  
- **ATS Optimization**: Bullet-pointed checklist of quick wins (e.g., add a “Skills” header, swap infographics for text).  
- **Score & Roadmap**: Numeric (0–10) and a 3-step action plan.

---

> **Total Score (out of 100)** = sum of all section scores.  

**Important**:  
- Always cite specific lines (or bullet numbers) when recommending changes.  
- Wherever possible, show a **“before vs. after”** example to illustrate a rephrasing or formatting fix.  
- If you detect missing context (e.g., no job description), prompt the user:  
  > “To give you a more targeted review, please share the job description or desired role.”  
`;

const percentageMatchPrompt = `
You are an **Expert ATS Resume Reviewer**. Your goal is to analyze a plain-text resume for both **ATS-compatibility** and **human readability**, then deliver **detailed, structured**, and **actionable** feedback.  

When you receive:
- resume_text (the candidate’s full resume in plain text)  
- Optional job_description(the target role or industry)

Follow these steps and output exactly in this format:

---
## 1. **ATS PARSABILITY** (out of 20)
- **Keyword Matching**: Rate how well the resume includes relevant keywords (job titles, skills) for the target role or, if none provided, for a typical software engineering role.  
- **Section Headings**: Check for standard, easily parsed headings (e.g., “Experience”, “Education”, “Skills”).  
- **File & Formatting Risks**: Identify any elements that may break ATS parsing (graphics, tables, unusual fonts, special characters).  
- **Score & Rationale**: Provide a numeric score (0–20) and 1–2 sentences explaining the biggest parsing risk.

## 2. **OVERALL ASSESSMENT** (out of 20)
- **Executive Summary**: 2–3 sentences on the resume’s clarity, focus, and suitability for the target role.  
- **Overall Score**: Numeric (0–20) based on structure, content depth, and impact.

## 3. **STRUCTURE & FORMATTING** (out of 20)
- **Layout & Flow**: Readability and logical ordering of sections.  
- **Consistency**: Uniform use of fonts, spacing, bullet styles, date formats.  
- **Visual Hierarchy**: Effective use of headings, bold/italics to guide the eye.  
- **Score & Notes**: Numeric (0–20) plus 2–3 bullet points on any issues.

## 4. **CONTENT & IMPACT** (out of 20)
- **Profile/Summary**: Presence and clarity of career objective or professional summary.  
- **Experience Details**: Use of **quantified achievements** (metrics, KPIs), **action verbs**, and **relevance** to the role.  
- **Skills Section**: Clear distinction between hard skills, soft skills, and tools/technologies.  
- **Education & Certifications**: Proper listing including dates, institutions, and relevance.  
- **Score & Highlights**: Numeric (0–20) plus top 3 content wins and top 3 content gaps.

## 5. **LANGUAGE, TONE & PROFESSIONALISM** (out of 10)
- **Grammar & Spelling**: Identify typos, verb-tense inconsistencies, and passive language.  
- **Tone**: Professional, confident, and tailored to the industry.  
- **Actionability**: Are suggestions phrased as concrete next steps?  
- **Score & Key Fixes**: Numeric (0–10) plus 2 suggested wording fixes.

## 6. **TAILORING & NEXT STEPS** (out of 10)
- **Customization Tips**: If no job description, suggest ways to tailor for different roles/industries.  
- **ATS Optimization**: Bullet-pointed checklist of quick wins (e.g., add a “Skills” header, swap infographics for text).  
- **Score & Roadmap**: Numeric (0–10) and a 3-step action plan.

---

> **Total Score (out of 100)** = sum of all section scores.  

**Important**:  
- Always cite specific lines (or bullet numbers) when recommending changes.  
- Wherever possible, show a **“before vs. after”** example to illustrate a rephrasing or formatting fix.  
- If you detect missing context (e.g., no job description), prompt the user:  
  > “To give you a more targeted review, please share the job description or desired role.”  
`;

export type AnalysisType = "detailed" | "percentage";

export async function analyzeResume(
  resumeUrl: string,
  jobDescription: string | null, // Allow jobDescription to be null
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

    // Select prompt based on analysis type and presence of job description
    let prompt:
      | typeof detailedReviewPrompt
      | typeof percentageMatchPrompt
      | typeof generalReviewPrompt;

    if (jobDescription && jobDescription.trim() !== "") {
      // Use job-specific prompts if job description is provided
      prompt =
        analysisType === "detailed"
          ? detailedReviewPrompt
          : percentageMatchPrompt;
    } else {
      // Use general review prompt if no job description is provided
      prompt = generalReviewPrompt;
      // Optionally force analysisType to 'detailed' or handle it based on UI logic
      // For now, we'll just use the general prompt regardless of the selected analysisType if no JD is present.
    }

    // Prepare the full prompt conditionally
    let fullPrompt;
    if(jobDescription && jobDescription.trim() !== ""){
        fullPrompt = `
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
    } else {
        fullPrompt = `
Resume Text:
---
${pdfText}
---

Analysis Task:
---
${prompt}
---
`;
    }

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
