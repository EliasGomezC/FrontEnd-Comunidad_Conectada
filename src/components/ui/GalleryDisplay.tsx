"use client";

import { IoImageOutline } from "react-icons/io5";

export interface GalleryDisplayImage {
  id: string;
  url: string;
}

interface GalleryDisplayProps {
  images?: GalleryDisplayImage[];
  size?: number;
}

export default function GalleryDisplay({
  images = [],
  size = 50,
}: GalleryDisplayProps) {
  if (!images.length) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {images.map((image) => (
        <div
          key={image.id}
          style={{ width: size, height: size, position: "relative" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt="Galería"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 10,
              display: "block",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function GalleryEmpty({ size = 50 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        border: "1px dashed #D9E2EC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94A3B8",
      }}
    >
      <IoImageOutline size={Math.round(size * 0.45)} />
    </div>
  );
}
