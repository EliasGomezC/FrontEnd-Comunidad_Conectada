"use client";

import type { ReactNode } from "react";

interface ModalFooterProps {
  children: ReactNode;
  gap?: number;
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
}

export default function ModalFooter({
  children,
  gap = 12,
  justify = "flex-end",
}: ModalFooterProps) {
  return (
    <div style={{ display: "flex", width: "100%", gap, justifyContent: justify }}>
      {children}
    </div>
  );
}
