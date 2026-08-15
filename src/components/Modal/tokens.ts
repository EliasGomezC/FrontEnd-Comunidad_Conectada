import type { CSSProperties } from "react";

export const colors = {
  background: "#FFFFFF",
  modalShadow: "rgba(15,23,42,.18)",
  border: "#D8E0E7",
  title: "#12486D",
  text: "#2F3C4A",
  placeholder: "#9AA5B1",
  primary: "#0A496A",
  primaryHover: "#0F5D87",
  secondary: "#FFFFFF",
  secondaryBorder: "#0A496A",
  secondaryText: "#0A496A",
  danger: "#EF4444",
  dangerHover: "#DC2626",
  input: "#FFFFFF",
  inputBorder: "#D5DCE3",
  overlay: "rgba(15, 23, 42, 0.25)",
  success: "#A8DC92",
  warning: "#FFD39C",
} as const;

export const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: 6,
  color: colors.text,
  fontWeight: 600,
  fontSize: 14,
};

export const fieldStyle: CSSProperties = {
  width: "100%",
  background: colors.input,
  border: `1px solid ${colors.inputBorder}`,
  borderRadius: 10,
  color: colors.text,
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
};
