
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = ({ className, ...props }: SearchInputProps) => {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input className={`pl-10 ${className}`} {...props} />
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
    <div className="flex flex-col justify-center  items-center px-4">
      {/* <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">

      </h2> */}
      <PlaceholdersAndVanishInput
      
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default SearchInput;
