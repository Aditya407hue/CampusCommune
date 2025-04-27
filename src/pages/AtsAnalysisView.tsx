import { useState, useRef, ChangeEvent } from "react";
import { analyzeResume, AnalysisType } from "@/services/atsService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileUpIcon,
  FileTextIcon,
  CheckCircleIcon,
  Loader2Icon,
} from "lucide-react";

function AtsAnalysisView() {
  const [jobDescription, setJobDescription] = useState("");
  const [analysisType, setAnalysisType] = useState<AnalysisType>("percentage");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // File handling state
  const [resume, setResume] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.includes("pdf")) {
        toast.error("Please upload a PDF resume");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setResume(file);
      toast.success("Resume uploaded successfully!");
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!resume) {
      toast.error("Please upload your resume.");
      return;
    }

    // Allow analysis even if job description is empty
    // The backend service will handle the case where jobDescription is null or empty.
    // if (!jobDescription) {
    //   toast.error("Please enter a job description.");
    //   return;
    // }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      // Create a URL for the uploaded file
      const resumeUrl = URL.createObjectURL(resume);

      const result = await analyzeResume(
        resumeUrl,
        jobDescription || null, // Pass null if jobDescription is empty
        analysisType
      );

      setAnalysisResult(result);
      toast.success("Resume analysis complete!");
    } catch (error) {
      console.error("ATS Analysis Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Analysis failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header Bar - bright blue to match screenshot */}
      <div className="py-4 mx-8 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold text-white">ATS Resume Analysis</h1>
        </div>
      </div>

      <main className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Section: Analysis Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Resume Upload Card */}
            <Card className="bg-white border-0 shadow-sm overflow-hidden">
              <CardHeader className="pb-2 border-b bg-gray-50/80">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5 text-blue-600" />
                  Upload Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="sr-only"
                      ref={fileInputRef}
                    />

                    {resume ? (
                      <div className="text-center">
                        <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500 mb-2" />
                        <p className="text-sm font-medium text-gray-900">
                          {resume.name}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          {(resume.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setResume(null)}
                        >
                          Remove & Upload Another
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FileUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900">
                          Click to upload your resume
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          PDF format up to 5MB
                        </p>
                        <Button
                          onClick={handleBrowseClick}
                          variant="outline"
                          className="border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          Browse Files
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description Card */}
            <Card className="bg-white border-0 shadow-sm overflow-hidden">
              <CardHeader className="pb-2 border-b bg-gray-50/80">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  placeholder="Paste the job description here... (e.g., required skills, responsibilities, qualifications)"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="border-gray-200 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </CardContent>
            </Card>

            {/* Analysis Options Card */}
            {/* <Card className="bg-white border-0 shadow-sm overflow-hidden">
              <CardHeader className="pb-2 border-b bg-gray-50/80">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Analysis Options
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RadioGroup
                  value={analysisType}
                  onValueChange={(value: "detailed" | "percentage") =>
                    setAnalysisType(value)
                  }
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem
                      value="percentage"
                      id="percentage"
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <Label
                        htmlFor="percentage"
                        className="font-medium text-gray-900 flex flex-col cursor-pointer"
                      >
                        <span>Percentage Match</span>
                        <span className="text-xs text-gray-500 font-normal mt-0.5">
                          Quantified score with keyword analysis
                        </span>
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem
                      value="detailed"
                      id="detailed"
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <Label
                        htmlFor="detailed"
                        className="font-medium text-gray-900 flex flex-col cursor-pointer"
                      >
                        <span>Detailed Review</span>
                        <span className="text-xs text-gray-500 font-normal mt-0.5">
                          Comprehensive analysis with specific feedback
                        </span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>     
              </CardContent>
            </Card> 
            */}
               <div className="mt-6">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isLoading || !jobDescription || !resume}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
                    size="lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing Resume...
                      </span>
                    ) : (
                      "Analyze Resume"
                    )}
                  </Button>
                </div>
          </div>

          {/* Right Section: Results */}
          <div className="lg:col-span-5">
            <Card className="bg-white border-0 shadow-sm overflow-hidden h-full">
              <CardHeader className="pb-2 border-b bg-gray-50/80">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="h-[400px] sm:h-[600px] flex items-center justify-center p-6">
                    <div className="flex flex-col items-center text-center">
                      <Loader2Icon className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                      <p className="text-gray-600 font-medium">
                        Processing your resume...
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Comparing against job description and analyzing match
                      </p>
                    </div>
                  </div>
                ) : analysisResult ? (
                  <div className="p-0">
                    <ScrollArea className="h-[400px] sm:h-[600px]">
                      <div className="p-6">
                        <div className="prose prose-blue max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {analysisResult}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="h-[400px] sm:h-[600px] flex items-center justify-center p-6 text-center">
                    <div>
                      <FileTextIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-gray-700 text-lg font-medium mb-2">
                        No Analysis Results Yet
                      </h3>
                      <p className="text-gray-500 max-w-sm mx-auto">
                        Upload your resume and provide a job description, then
                        click "Analyze Resume" to see results here.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AtsAnalysisView;
