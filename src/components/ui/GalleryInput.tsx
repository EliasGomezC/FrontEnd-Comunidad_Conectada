"use client";

import { useEffect, useRef, useState } from "react";
import { IoAdd, IoClose, IoImageOutline } from "react-icons/io5";

export interface GalleryStoredImage {
  id: string;
  url: string;
}

interface GalleryInputProps {
  images?: GalleryStoredImage[];
  onChange?: (files: File[], removedIds: string[]) => void;
  size?: number;
}

const border = "#D9E2EC";
const placeholder = "#94A3B8";

export default function GalleryInput({
  images = [],
  onChange,
  size = 72,
}: GalleryInputProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    const pending = urls;
    return () => pending.forEach((url) => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = (next: File[]) => {
    const combined = [...files, ...next];
    setFiles(combined);
    setUrls((prev) => [...prev, ...next.map((file) => URL.createObjectURL(file))]);
    onChange?.(combined, removedIds);
  };

  const removeAt = (index: number) => {
    const kept = images.filter((img) => !removedIds.includes(img.id));
    let nextRemoved = removedIds;
    let nextFiles = files;
    if (index < kept.length) {
      nextRemoved = [...removedIds, kept[index].id];
      setRemovedIds(nextRemoved);
    } else {
      const fileIndex = index - kept.length;
      URL.revokeObjectURL(urls[fileIndex]);
      nextFiles = files.filter((_, i) => i !== fileIndex);
      setFiles(nextFiles);
      setUrls((prev) => prev.filter((_, i) => i !== fileIndex));
    }
    onChange?.(nextFiles, nextRemoved);
  };

  const displayed = [
    ...images.filter((img) => !removedIds.includes(img.id)).map((img) => img.url),
    ...urls,
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {displayed.length === 0 && (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: 10,
            border: `1px dashed ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: placeholder,
          }}
        >
          <IoImageOutline size={Math.round(size * 0.45)} />
        </div>
      )}

      {displayed.map((src, index) => (
        <div
          key={`${src}-${index}`}
          style={{ position: "relative", width: size, height: size }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
          <button
            onClick={() => removeAt(index)}
            aria-label="Quitar imagen"
            className="grid place-items-center rounded-full text-white"
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              width: 20,
              height: 20,
              border: "none",
              background: "#dc2626",
              cursor: "pointer",
            }}
          >
            <IoClose size={14} />
          </button>
        </div>
      ))}

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          if (event.target.files?.length) {
            addFiles(Array.from(event.target.files));
          }
          event.target.value = "";
        }}
      />
      <button
        onClick={() => fileInput.current?.click()}
        className="flex flex-col items-center justify-center"
        style={{
          width: size,
          height: size,
          borderRadius: 10,
          border: `2px dashed ${border}`,
          background: "#F8FAFC",
          color: placeholder,
          cursor: "pointer",
          gap: 2,
        }}
      >
        <IoAdd size={Math.round(size * 0.35)} />
        <span style={{ fontSize: 11, fontWeight: 600 }}>Agregar</span>
      </button>
    </div>
  );
}
