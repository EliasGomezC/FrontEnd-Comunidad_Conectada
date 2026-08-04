"use client";

import type { ReactNode } from "react";

interface ModalFooterProps {
  children: ReactNode;
}

export default function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div style={{ display: "flex", width: "100%", gap: 12 }}>{children}</div>
  );
}
