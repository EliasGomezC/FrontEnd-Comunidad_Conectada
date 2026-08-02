"use client";

import { useEffect, type ReactNode } from "react";
import { IoClose } from "react-icons/io5";
import { colors } from "@/components/Modal/tokens";

interface BaseModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export default function BaseModal({
  open,
  title,
  onClose,
  children,
  footer,
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: colors.overlay, backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="flex w-full flex-col overflow-hidden"
        style={{
          width: "min(900px, 100%)",
          maxHeight: 650,
          background: colors.background,
          borderRadius: 20,
          boxShadow: "0 20px 50px rgba(0, 0, 0, .18)",
          animation: "modalEnter .2s ease",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex items-center justify-between"
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <h2 className="m-0 text-[22px] font-bold" style={{ color: colors.title }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-slate-100"
            style={{ color: colors.text }}
          >
            <IoClose size={24} />
          </button>
        </div>

        <div
          className="flex flex-col overflow-y-auto"
          style={{ padding: 24, flex: 1 }}
        >
          {children}
        </div>

        {footer && (
          <div style={{ padding: "0 24px 20px" }}>
            <div style={{ display: "flex", gap: 12 }}>{footer}</div>
          </div>
        )}
      </div>

      <style>{`@keyframes modalEnter { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </div>
  );
}
