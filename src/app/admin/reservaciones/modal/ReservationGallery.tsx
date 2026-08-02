"use client";

import { IoImageOutline } from "react-icons/io5";
import { colors } from "@/components/Modal/tokens";

interface ReservationGalleryProps {
  images?: string[];
}

export default function ReservationGallery({ images = [] }: ReservationGalleryProps) {
  const slots = Math.max(2, images.length);

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {Array.from({ length: slots }).map((_, index) =>
        images[index] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={index}
            src={images[index]}
            alt={`Imagen ${index + 1}`}
            style={{
              width: 220,
              height: 120,
              objectFit: "cover",
              borderRadius: 10,
              display: "block",
            }}
          />
        ) : (
          <div
            key={index}
            className="flex items-center justify-center"
            style={{
              width: 220,
              height: 120,
              borderRadius: 10,
              border: `1px dashed ${colors.inputBorder}`,
              background: colors.input,
              color: colors.placeholder,
            }}
          >
            <IoImageOutline size={32} />
          </div>
        )
      )}
    </div>
  );
}
