"use client";

import ImageUploader from "@/components/ui/ImageUploader";

interface EventImageUploaderProps {
  image?: string | null;
  onChange: (file: File | null) => void;
}

export default function EventImageUploader({ image, onChange }: EventImageUploaderProps) {
  return <ImageUploader image={image} onChange={onChange} height={140} />;
}
