"use client";

import { IoSearch } from "react-icons/io5";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar = ({
  placeholder = "Buscar...",
  onSearch,
  className = "",
}: SearchBarProps) => {
  return (
    <div className={`flex items-center bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
      <div className="pl-4">
        <IoSearch className="text-slate-400 h-5 w-5" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 px-4 py-3 bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
