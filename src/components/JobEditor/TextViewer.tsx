import { Card, CardContent } from "@/components/ui/card";

interface TextViewerProps {
  text: string;
}

export const TextViewer = ({ text }: TextViewerProps) => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="whitespace-pre-wrap font-mono text-sm">
          {text}
        </div>
      </CardContent>
    </Card>
  );
};