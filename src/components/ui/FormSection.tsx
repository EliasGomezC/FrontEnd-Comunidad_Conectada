"use client";

import type { ReactNode } from "react";
import { colors } from "@/components/Modal/tokens";

interface FormSectionProps {
  label?: string;
  children: ReactNode;
}

export default function FormSection({ label, children }: FormSectionProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && (
        <span style={{ color: colors.text, fontWeight: 600, fontSize: 14 }}>{label}</span>
      )}
      {children}
    </div>
  );
}
