import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Edit, View } from "lucide-react";
import { TextViewer } from "@/components/JobEditor/TextViewer";
import { JsonEditor } from "@/components/JobEditor/JsonEditor";

const sampleText =
  "Welcome to the Job Editor!\n\nThis is a sample text that demonstrates how new lines work.\nYou can edit the JSON on the right side.\n\nThe editor supports:\n- View mode\n- Edit mode\n- JSON validation\n- Easy formatting";

const initialJobData = {
  title: "",
  company: "",
  description: "",
  location: "",
  type: "full-time",
  skills: ["Java", "C++"],
  salary: {
    stipend: "",
    postConfirmationCTC: "",
  },
  deadline: "",
  applicationLink: [""],
  moreDetails: {
    eligibility: "",
    selectionProcess: "",
    serviceAgreement: "",
    training: "",
    joiningDate: "",
    requiredDocuments: "",
    companyWebsite: "",
  },
};

const JobEditor = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [jsonData, setJsonData] = useState(initialJobData);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <Toggle
            pressed={isEditMode}
            onPressedChange={setIsEditMode}
            className="gap-2"
          >
            {isEditMode ? (
              <>
                <Edit className="h-4 w-4" />
                Edit Mode
              </>
            ) : (
              <>
                <View className="h-4 w-4" />
                View Mode
              </>
            )}
          </Toggle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TextViewer text={sampleText} />
          <JsonEditor
            data={jsonData}
            isEditMode={isEditMode}
            onChange={setJsonData}
          />
        </div>
      </main>
    </div>
  );
};

export default JobEditor;
