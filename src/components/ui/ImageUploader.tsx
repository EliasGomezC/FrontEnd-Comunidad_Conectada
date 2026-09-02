"use client";

import { useRef, useState } from "react";
import { IoCloudUploadOutline, IoClose } from "react-icons/io5";

interface ImageUploaderProps {
  image?: string | null;
  onChange: (file: File | null) => void;
  height?: number;
  borderColor?: string;
  iconColor?: string;
}

export default function ImageUploader({
  image,
  onChange,
  height = 140,
  borderColor = "#D9E2EC",
  iconColor = "#94A3B8",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      {image ? (
        <div style={{ position: "relative", width: "100%", height }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Vista previa"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 14,
              display: "block",
            }}
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Quitar imagen"
            className="grid place-items-center rounded-full text-white"
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 28,
              height: 28,
              border: "none",
              background: "rgba(15, 23, 42, 0.5)",
              cursor: "pointer",
            }}
          >
            <IoClose size={18} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files?.[0];
            if (file) onChange(file);
          }}
          className="flex w-full flex-col items-center justify-center"
          style={{
            height,
            borderRadius: 14,
            border: `2px dashed ${dragging ? "#0A496A" : borderColor}`,
            background: "#FFFFFF",
            cursor: "pointer",
            gap: 8,
            transition: "border-color .15s ease",
          }}
        >
          <IoCloudUploadOutline size={32} style={{ color: iconColor }} />
          <span style={{ color: "#6B7280", fontSize: 14 }}>
            Arrastra una imagen aquí o haz clic para elegir
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0] || null;
          onChange(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
