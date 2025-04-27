import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X } from "lucide-react";

interface JobPostingFormProps {
  data: any;
  onChange: (data: any) => void;
  isEditMode: boolean;
}

export function JobPostingForm({
  data,
  onChange,
  isEditMode,
}: JobPostingFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleSalaryChange = (field: string, value: string) => {
    onChange({
      ...data,
      salary: { ...data.salary, [field]: value },
    });
  };

  const handleMoreDetailsChange = (field: string, value: any) => {
    onChange({
      ...data,
      moreDetails: { ...data.moreDetails, [field]: value },
    });
  };

  const addSkill = () => {
    const skills = [...(data.skills || []), ""];
    onChange({ ...data, skills });
  };

  const updateSkill = (index: number, value: string) => {
    const skills = [...(data.skills || [])];
    skills[index] = value;
    onChange({ ...data, skills });
  };

  const removeSkill = (index: number) => {
    const skills = [...(data.skills || [])];
    skills.splice(index, 1);
    onChange({ ...data, skills });
  };

  const addSelectionProcess = () => {
    const selectionProcess = [...(data.moreDetails.selectionProcess || []), ""];
    handleMoreDetailsChange("selectionProcess", selectionProcess);
  };

  const updateSelectionProcess = (index: number, value: string) => {
    const selectionProcess = [...(data.moreDetails.selectionProcess || [])];
    selectionProcess[index] = value;
    handleMoreDetailsChange("selectionProcess", selectionProcess);
  };

  const removeSelectionProcess = (index: number) => {
    const selectionProcess = [...(data.moreDetails.selectionProcess || [])];
    selectionProcess.splice(index, 1);
    handleMoreDetailsChange("selectionProcess", selectionProcess);
  };

  const addApplicationLink = () => {
    const applicationLink = [...(data.applicationLink || []), ""];
    onChange({ ...data, applicationLink });
  };

  const updateApplicationLink = (index: number, value: string) => {
    const applicationLink = [...(data.applicationLink || [])];
    applicationLink[index] = value;
    onChange({ ...data, applicationLink });
  };

  const removeApplicationLink = (index: number) => {
    const applicationLink = [...(data.applicationLink || [])];
    applicationLink.splice(index, 1);
    onChange({ ...data, applicationLink });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Basic Information
          </h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={data.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                disabled={!isEditMode}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={data.company || ""}
                onChange={(e) => handleChange("company", e.target.value)}
                disabled={!isEditMode}
                placeholder="e.g., Tech Solutions Inc."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={data.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={!isEditMode}
                placeholder="Describe the role and responsibilities..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Details Section */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Job Details
          </h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={data.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                disabled={!isEditMode}
                placeholder="e.g., Remote, New York, NY"
              />
            </div>

            <div className="grid gap-2">
              <Label>Job Type</Label>
              <RadioGroup
                value={data.type || "full-time"}
                onValueChange={(value) => handleChange("type", value)}
                disabled={!isEditMode}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full-time" id="full-time" />
                  <Label htmlFor="full-time">Full-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="part-time" id="part-time" />
                  <Label htmlFor="part-time">Part-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="internship" id="internship" />
                  <Label htmlFor="internship">Internship</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="trainee" id="trainee" />
                  <Label htmlFor="trainee">Trainee</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label>Required Skills</Label>
              <div className="space-y-2">
                {(data.skills || []).map((skill: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      disabled={!isEditMode}
                      placeholder="e.g., React, TypeScript"
                    />
                    {isEditMode && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeSkill(index)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {isEditMode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSkill}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compensation Section */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Compensation
          </h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="stipend">Stipend</Label>
              <Input
                id="stipend"
                value={data.salary?.stipend || ""}
                onChange={(e) => handleSalaryChange("stipend", e.target.value)}
                disabled={!isEditMode}
                placeholder="e.g., ₹20,000/month"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ctc">Post Confirmation CTC</Label>
              <Input
                id="ctc"
                value={data.salary?.postConfirmationCTC || ""}
                onChange={(e) =>
                  handleSalaryChange("postConfirmationCTC", e.target.value)
                }
                disabled={!isEditMode}
                placeholder="e.g., ₹8,00,000/year"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Details Section */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Additional Details
          </h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="eligibility">Eligibility Criteria</Label>
              <Textarea
                id="eligibility"
                value={data.moreDetails?.eligibility || ""}
                onChange={(e) =>
                  handleMoreDetailsChange("eligibility", e.target.value)
                }
                disabled={!isEditMode}
                placeholder="Describe the eligibility requirements..."
              />
            </div>

            <div className="grid gap-2">
              <Label>Selection Process</Label>
              <div className="space-y-2">
                {(data.moreDetails?.selectionProcess || []).map(
                  (step: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={step}
                        onChange={(e) =>
                          updateSelectionProcess(index, e.target.value)
                        }
                        disabled={!isEditMode}
                        placeholder="e.g., Technical Interview"
                      />
                      {isEditMode && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeSelectionProcess(index)}
                          className="shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )
                )}
                {isEditMode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSelectionProcess}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="serviceAgreement">Service Agreement</Label>
              <Input
                id="serviceAgreement"
                value={data.moreDetails?.serviceAgreement || ""}
                onChange={(e) =>
                  handleMoreDetailsChange("serviceAgreement", e.target.value)
                }
                disabled={!isEditMode}
                placeholder="e.g., 2 years bond"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="training">Training Period</Label>
              <Input
                id="training"
                value={data.moreDetails?.training || ""}
                onChange={(e) =>
                  handleMoreDetailsChange("training", e.target.value)
                }
                disabled={!isEditMode}
                placeholder="e.g., 3 months"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="joiningDate">Expected Joining Date</Label>
              <Input
                id="joiningDate"
                value={data.moreDetails?.joiningDate || ""}
                onChange={(e) =>
                  handleMoreDetailsChange("joiningDate", e.target.value)
                }
                disabled={!isEditMode}
                placeholder="e.g., July 2024"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="requiredDocuments">Required Documents</Label>
              <Textarea
                id="requiredDocuments"
                value={data.moreDetails?.requiredDocuments || ""}
                onChange={(e) =>
                  handleMoreDetailsChange("requiredDocuments", e.target.value)
                }
                disabled={!isEditMode}
                placeholder="List required documents..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input
                id="companyWebsite"
                value={data.moreDetails?.companyWebsite || ""}
                onChange={(e) =>
                  handleMoreDetailsChange("companyWebsite", e.target.value)
                }
                disabled={!isEditMode}
                placeholder="e.g., https://company.com"
              />
            </div>

            <div className="grid gap-2">
              <Label>Application Links</Label>
              <div className="space-y-2">
                {(data.applicationLink || []).map(
                  (link: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={link}
                        onChange={(e) =>
                          updateApplicationLink(index, e.target.value)
                        }
                        disabled={!isEditMode}
                        placeholder="e.g., https://apply.company.com"
                      />
                      {isEditMode && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeApplicationLink(index)}
                          className="shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )
                )}
                {isEditMode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addApplicationLink}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Application Link
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
