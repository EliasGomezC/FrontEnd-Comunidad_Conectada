"use client";

import { useEffect, type ReactNode } from "react";
import { colors } from "@/components/Modal/tokens";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  titleSize?: number | string;
  subtitleSize?: number | string;
  subtitleColor?: string;
  width?: number | string;
  maxHeight?: number | string;
  padding?: number | string;
  overlay?: string;
  footer?: ReactNode;
  footerGap?: number;
  footerJustify?: "flex-start" | "center" | "flex-end" | "space-between";
  children: ReactNode;
}

export default function BaseModal({
  open,
  onClose,
  title,
  subtitle,
  titleSize = 22,
  subtitleSize = 16,
  subtitleColor = "#6B7280",
  width = 640,
  maxHeight = "85vh",
  padding = 24,
  overlay = "rgba(15, 23, 42, 0.25)",
  footer,
  footerGap = 12,
  footerJustify = "flex-end",
  children,
}: BaseModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const widthValue = typeof width === "number" ? `min(${width}px, 100%)` : width;
  const paddingValue = typeof padding === "number" ? `${padding}px` : padding;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: overlay, backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="flex w-full flex-col overflow-hidden"
        style={{
          width: widthValue,
          maxHeight,
          background: colors.background,
          borderRadius: 20,
          boxShadow: "0 20px 50px rgba(0, 0, 0, .18)",
          animation: "modalEnter .2s ease",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <ModalHeader
          title={title}
          subtitle={subtitle}
          titleSize={titleSize}
          subtitleSize={subtitleSize}
          subtitleColor={subtitleColor}
          padding={paddingValue}
          onClose={onClose}
        />

        <div
          className="flex flex-col overflow-y-auto"
          style={{ padding: `0 ${paddingValue} ${paddingValue}`, flex: 1 }}
        >
          {children}
        </div>

        {footer && (
          <div style={{ padding: `0 ${paddingValue} ${paddingValue}` }}>
            <ModalFooter gap={footerGap} justify={footerJustify}>
              {footer}
            </ModalFooter>
          </div>
        )}
      </div>

      <style>{`@keyframes modalEnter { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </div>
  );
}
