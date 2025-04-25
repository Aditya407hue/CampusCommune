import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: () => void;
  showButton?: boolean;
}

const SearchInput = ({
  className,
  onSearch,
  showButton = false,
  ...props
}: SearchInputProps) => {
  return (
    <div className="relative flex w-full gap-2">
      <Input
        icon={<SearchIcon className="h-4 w-4" />}
        className={`${className}`}
        placeholder={props.placeholder || "Search..."}
        {...props}
      />
      {showButton && (
        <Button
          onClick={onSearch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          size="default"
        >
          Search
        </Button>
      )}
    </div>
  );
};

import { PlaceholdersAndVanishInput } from "./../components/ui/vanish-input";

export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="flex flex-col justify-center items-center px-4 w-full">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
        className="w-full max-w-lg"
      />
    </div>
  );
}

export default SearchInput;
