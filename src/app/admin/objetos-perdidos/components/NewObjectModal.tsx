"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { IoClose, IoImageOutline } from "react-icons/io5";

export interface NewObjectPayload {
  type: "lost" | "found";
  title: string;
  location: string;
  description: string;
  image: string;
}

interface NewObjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (object: NewObjectPayload) => void;
}

const initialForm: NewObjectPayload = {
  type: "lost",
  title: "",
  location: "",
  description: "",
  image: "",
};

export default function NewObjectModal({ isOpen, onClose, onCreate }: NewObjectModalProps) {
  const [form, setForm] = useState<NewObjectPayload>(initialForm);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const closeModal = () => {
    setForm(initialForm);
    setError("");
    onClose();
  };

  const updateField = (field: keyof NewObjectPayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen válido.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateField("image", String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      setError("Completa los campos obligatorios.");
      return;
    }

    onCreate({
      ...form,
      title: form.title.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
    });
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-3 sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[90vh] w-full max-w-[402px] overflow-y-auto rounded-2xl border-4 border-[#0a5a84] bg-[#f4f7fb] p-4 text-[#344054] shadow-2xl"
        aria-labelledby="new-object-title"
      >
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-3 top-3 text-2xl leading-none text-[#98a2b3] hover:text-[#475467]"
          aria-label="Cerrar formulario"
        >
          <IoClose />
        </button>

        <h2 id="new-object-title" className="mb-4 text-2xl font-medium leading-none text-[#075277] sm:text-[31px]">
          Crear objeto
        </h2>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label htmlFor="object-type" className="text-sm font-bold">
            Tipo <span className="text-red-500">*</span>
          </label>
          <select
            id="object-type"
            value={form.type}
            onChange={(event) => updateField("type", event.target.value)}
            className="h-11 flex-1 min-w-[120px] rounded-lg border-0 bg-white px-3 text-sm text-gray-600 shadow-md outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0a5a84]"
          >
            <option value="lost">Extraviado</option>
            <option value="found">Resguardado</option>
          </select>
        </div>

        <label htmlFor="object-title" className="mb-2 block text-sm font-bold">
          Nombre del objeto <span className="text-red-500">*</span>
        </label>
        <input
          id="object-title"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="Escribe el nombre del objeto"
          className="mb-3 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none placeholder:text-gray-500 focus:border-[#0a5a84]"
        />

        <label htmlFor="object-location" className="mb-2 block text-sm font-bold">
          Ubicación
        </label>
        <input
          id="object-location"
          value={form.location}
          onChange={(event) => updateField("location", event.target.value)}
          placeholder="Escribe donde se encontró el objeto"
          className="mb-3 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none placeholder:text-gray-500 focus:border-[#0a5a84]"
        />

        <label htmlFor="object-description" className="mb-2 block text-sm font-bold">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          id="object-description"
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Escribe la descripción del objeto"
          rows={2}
          className="mb-3 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-500 focus:border-[#0a5a84]"
        />

        <span className="mb-2 block text-sm font-bold">Imagen</span>
        <label className="mb-5 grid h-36 sm:h-44 cursor-pointer place-items-center overflow-hidden rounded-[30px] bg-white hover:bg-gray-50">
          <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
          {form.image ? (
            <img src={form.image} alt="Vista previa del objeto" className="h-full w-full object-contain" />
          ) : (
            <span className="grid place-items-center gap-2 text-gray-300">
              <IoImageOutline className="text-5xl sm:text-6xl" />
              <span className="text-xs">Seleccionar imagen</span>
            </span>
          )}
        </label>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <div className="flex flex-col-reverse justify-center gap-3 sm:flex-row sm:gap-4">
          <button type="button" onClick={closeModal} className="w-full rounded-full border border-black bg-white px-6 py-1.5 text-lg font-semibold text-[#075277] sm:w-auto sm:text-xl">
            Cancelar
          </button>
          <button type="submit" className="w-full rounded-full bg-[#075277] px-8 py-1.5 text-lg font-semibold text-white shadow hover:bg-[#064665] sm:w-auto sm:text-xl">
            Crear
          </button>
        </div>
      </form>
    </div>
  );
}