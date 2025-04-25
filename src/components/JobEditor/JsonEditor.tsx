import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface JsonEditorProps {
  data: any;
  isEditMode: boolean;
  onChange: (data: any) => void;
}

export const JsonEditor = ({ data, isEditMode, onChange }: JsonEditorProps) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (path: string[], value: any) => {
    const newData = { ...formData };
    let current = newData;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }

    current[path[path.length - 1]] = value;
    setFormData(newData);
    onChange(newData);
  };

  const renderEditableValue = (path: string[], value: any, label: string) => {
    if (Array.isArray(value)) {
      return (
        <Input
          value={value.join(", ")}
          onChange={(e) =>
            handleChange(
              path,
              e.target.value.split(", ").map((s) => s.trim())
            )
          }
          placeholder={`Enter ${label} (comma-separated)`}
        />
      );
    }

    if (typeof value === "string") {
      return label.toLowerCase().includes("description") ||
        label.toLowerCase().includes("process") ? (
        <Textarea
          value={value}
          onChange={(e) => handleChange(path, e.target.value)}
          placeholder={`Enter ${label}`}
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => handleChange(path, e.target.value)}
          placeholder={`Enter ${label}`}
        />
      );
    }

    return null;
  };

  const renderField = (key: string, value: any, path: string[] = []) => {
    const currentPath = [...path, key];
    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return (
        <div key={key} className="space-y-4">
          <h3 className="text-lg font-semibold mt-4 first:mt-0">{label}</h3>
          <div className="pl-4 space-y-4">
            {Object.entries(value).map(([k, v]) =>
              renderField(k, v, currentPath)
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={key} className="space-y-2">
        <Label>{label}</Label>
        {isEditMode ? (
          renderEditableValue(currentPath, value, label)
        ) : (
          <div className="text-sm bg-muted p-2 rounded">
            {Array.isArray(value) ? value.join(", ") : String(value)}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="space-y-6">
          {Object.entries(formData).map(([key, value]) =>
            renderField(key, value)
          )}
        </div>
      </CardContent>
    </Card>
  );
};
