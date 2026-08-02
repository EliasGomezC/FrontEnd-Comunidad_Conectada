"use client";

import type { CSSProperties } from "react";
import { fieldStyle, labelStyle } from "./Modal/tokens";

interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  height?: number;
  radius?: number;
  paddingX?: number;
  min?: number;
  max?: number;
  className?: string;
}

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  multiline,
  height,
  radius,
  paddingX,
  min,
  max,
  className,
}: InputProps) {
  const field: CSSProperties = {
    ...fieldStyle,
    borderRadius: radius ?? 10,
    ...(multiline
      ? { minHeight: height ?? 96, padding: `12px ${paddingX ?? 14}px`, resize: "vertical" as const }
      : { height: height ?? 48, padding: `0 ${paddingX ?? 14}px` }),
  };

  return (
    <label style={{ display: "block" }} className={className}>
      {label && <span style={labelStyle}>{label}</span>}
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          rows={3}
          style={field}
          className="placeholder:text-[#9AA5B1]"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          style={field}
          className="placeholder:text-[#9AA5B1]"
        />
      )}
    </label>
  );
}
