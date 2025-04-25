import { useState } from "react";
import { analyzeResume, AnalysisType } from "@/services/atsService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function AtsAnalysisView() {
  const [jobDescription, setJobDescription] = useState("");
  const [analysisType, setAnalysisType] = useState<AnalysisType>("detailed");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded resume filename
  const resumeFilename = "Ritam Chatterjee Resume april.pdf";

  const handleAnalyze = async () => {
    if (!jobDescription) {
      toast.error("Please enter a job description.");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeResume(
        "https://drive.google.com/file/d/10PVhmZfHuvh7dYf_FIhYZoDMTrq0c7Ws/view?usp=sharing",
        jobDescription,
        analysisType
      );
      setAnalysisResult(result);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("ATS Analysis Error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Analysis failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">ATS Resume Analysis</h1>

      <div className="space-y-4 p-6 border rounded-lg shadow-sm bg-white">
        <p className="text-sm text-gray-600">
          Using resume: <span className="font-medium">{resumeFilename}</span>
        </p>
        <div>
          <Label htmlFor="jobDescription" className="text-lg font-semibold mb-2 block">Job Description</Label>
          <Textarea
            id="jobDescription"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <Label className="text-lg font-semibold mb-2 block">Analysis Type</Label>
          <RadioGroup
            defaultValue="detailed"
            value={analysisType}
            onValueChange={(value: "detailed" | "percentage") => setAnalysisType(value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailed" id="detailed" />
              <Label htmlFor="detailed">Detailed Review</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage">Percentage Match</Label>
            </div>
          </RadioGroup>
        </div>

        <Button onClick={handleAnalyze} disabled={isLoading || !jobDescription} className="w-full bg-indigo-600 hover:bg-indigo-700">
          {isLoading ? "Analyzing..." : "Analyze Resume"}
        </Button>
      </div>

      {analysisResult && (
        <div className="mt-6 p-6 border rounded-lg shadow-sm bg-white">
          <h2 className="text-2xl font-semibold mb-4">Analysis Result</h2>
          <div className="prose prose-indigo max-w-none">
            {/* Use ReactMarkdown to render the result */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysisResult}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default AtsAnalysisView;