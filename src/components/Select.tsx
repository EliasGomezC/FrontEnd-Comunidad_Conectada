"use client";

import type { CSSProperties } from "react";
import { fieldStyle, labelStyle } from "./Modal/tokens";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  height?: number;
  radius?: number;
  paddingX?: number;
  className?: string;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  height,
  radius,
  paddingX,
  className,
}: SelectProps) {
  const field: CSSProperties = {
    ...fieldStyle,
    height: height ?? 48,
    padding: `0 ${paddingX ?? 14}px`,
    borderRadius: radius ?? 10,
    appearance: "auto",
    background: "#FFFFFF",
  };

  return (
    <label style={{ display: "block" }} className={className}>
      {label && <span style={labelStyle}>{label}</span>}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        style={field}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
