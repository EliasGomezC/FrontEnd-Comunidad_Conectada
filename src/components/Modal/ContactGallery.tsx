"use client";

import { useRef } from "react";
import { IoAdd, IoClose, IoImageOutline } from "react-icons/io5";
import { colors } from "./tokens";

interface ContactGalleryProps {
  images: string[];
  editable?: boolean;
  size?: number;
  onAdd?: (files: File[]) => void;
  onRemove?: (index: number) => void;
}

export default function ContactGallery({
  images,
  editable = false,
  size,
  onAdd,
  onRemove,
}: ContactGalleryProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const thumb = size ?? (editable ? 72 : 50);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {images.length === 0 && (
        <div
          style={{
            width: thumb,
            height: thumb,
            borderRadius: 10,
            border: `1px dashed ${colors.inputBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.placeholder,
          }}
        >
          <IoImageOutline size={Math.round(thumb * 0.45)} />
        </div>
      )}

      {images.map((src, index) => (
        <div
          key={`${src}-${index}`}
          style={{ position: "relative", width: thumb, height: thumb }}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={`Imagen ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 10,
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                border: `1px dashed ${colors.inputBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.placeholder,
              }}
            >
              <IoImageOutline size={Math.round(thumb * 0.45)} />
            </div>
          )}
          {editable && onRemove && (
            <button
              onClick={() => onRemove(index)}
              aria-label="Quitar imagen"
              className="grid place-items-center rounded-full text-white"
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                width: 20,
                height: 20,
                border: "none",
                background: colors.danger,
                cursor: "pointer",
              }}
            >
              <IoClose size={14} />
            </button>
          )}
        </div>
      ))}

      {editable && (
        <>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => {
              if (event.target.files?.length) {
                onAdd?.(Array.from(event.target.files));
              }
              event.target.value = "";
            }}
          />
          <button
            onClick={() => fileInput.current?.click()}
            className="flex flex-col items-center justify-center"
            style={{
              width: thumb,
              height: thumb,
              borderRadius: 10,
              border: `2px dashed ${colors.inputBorder}`,
              background: colors.input,
              color: colors.placeholder,
              cursor: "pointer",
              gap: 2,
            }}
          >
            <IoAdd size={Math.round(thumb * 0.35)} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>Agregar</span>
          </button>
        </>
      )}
    </div>
  );
}
