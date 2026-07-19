"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Ocurrió un error inesperado.</p>
      <button onClick={() => reset()}>Reintentar</button>
    </div>
  );
}
