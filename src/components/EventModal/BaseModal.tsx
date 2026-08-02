"use client";

import type { ReactNode } from "react";
import BaseModal from "@/components/ui/BaseModal";

interface EventBaseModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

export default function EventBaseModal({
  open,
  title,
  subtitle,
  footer,
  onClose,
  children,
}: EventBaseModalProps) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      width={900}
      maxHeight="90vh"
      padding={32}
      titleSize={32}
      subtitleSize={18}
      subtitleColor="#6B7280"
      overlay="rgba(15, 23, 42, 0.30)"
      footer={footer}
      footerGap={20}
      footerJustify="center"
    >
      {children}
    </BaseModal>
  );
}
