"use client";

import { useState, type ButtonHTMLAttributes } from "react";
import { colors } from "./Modal/tokens";

type Variant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const VARIANTS: Record<
  Variant,
  { background: string; hoverBackground: string; color: string; borderColor: string; hoverBorderColor: string }
> = {
  primary: {
    background: colors.primary,
    hoverBackground: colors.primaryHover,
    color: "#FFFFFF",
    borderColor: colors.primary,
    hoverBorderColor: colors.primaryHover,
  },
  secondary: {
    background: colors.secondary,
    hoverBackground: colors.secondary,
    color: colors.secondaryText,
    borderColor: colors.secondaryBorder,
    hoverBorderColor: colors.primaryHover,
  },
  danger: {
    background: colors.danger,
    hoverBackground: colors.dangerHover,
    color: "#FFFFFF",
    borderColor: colors.danger,
    hoverBorderColor: colors.dangerHover,
  },
};

export default function Button({
  variant = "primary",
  loading,
  disabled,
  children,
  style,
  ...rest
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const config = VARIANTS[variant];
  const isDisabled = disabled || loading;

  return (
    <button
      {...rest}
      disabled={isDisabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 48,
        padding: "0 20px",
        borderRadius: 10,
        fontWeight: 600,
        fontSize: 15,
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "background .15s ease, border-color .15s ease",
        background: hovered ? config.hoverBackground : config.background,
        color: config.color,
        border: `1px solid ${hovered ? config.hoverBorderColor : config.borderColor}`,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
