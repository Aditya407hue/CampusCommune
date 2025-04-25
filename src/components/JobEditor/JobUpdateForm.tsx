import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, FileText } from "lucide-react";

interface JobUpdateFormProps {
  data: any;
  onChange: (data: any) => void;
  isEditMode: boolean;
}

export function JobUpdateForm({
  data,
  onChange,
  isEditMode,
}: JobUpdateFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            Company Information
          </h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={data.companyName || ""}
                onChange={(e) => handleChange("companyName", e.target.value)}
                disabled={!isEditMode}
                placeholder="Enter company name"
                className="bg-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Details */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Update Information
          </h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="summary">Update Summary</Label>
              <Textarea
                id="summary"
                value={data.summary || ""}
                onChange={(e) => handleChange("summary", e.target.value)}
                disabled={!isEditMode}
                placeholder="Enter update details..."
                className="min-h-[200px] bg-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
