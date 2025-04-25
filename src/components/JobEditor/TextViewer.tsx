interface TextViewerProps {
  text: string;
}

export function TextViewer({ text }: TextViewerProps) {
  return (
    <div className="prose prose-sm max-w-none">
      {text.split("\n").map((line, index) => (
        <p
          key={index}
          className={`mb-2 ${
            line.trim() === "" ? "h-4" : "text-gray-700 leading-relaxed"
          }`}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
