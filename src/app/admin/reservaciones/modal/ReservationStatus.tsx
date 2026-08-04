"use client";

export type ReservationStatusType = "pending" | "approved" | "rejected" | "completed";

export const reservationColors = {
  pending: { background: "#FFE2B7", text: "#8A5310", border: "#FFD29A" },
  approved: { background: "#BFE6AA", text: "#2E6B2E", border: "#9FD68D" },
  rejected: { background: "#F6C1BA", text: "#9A2F2F", border: "#EEAAA2" },
  completed: { background: "#C9CCFF", text: "#3E4D96", border: "#B7BAFF" },
} as const;

const LABELS: Record<ReservationStatusType, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
  completed: "Completado",
};

export const backendToStatus: Record<string, ReservationStatusType> = {
  pendiente: "pending",
  aprobada: "approved",
  cancelada: "rejected",
};

export default function ReservationStatus({
  status,
}: {
  status: ReservationStatusType;
}) {
  const color = reservationColors[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold"
      style={{
        background: color.background,
        color: color.text,
        border: `1px solid ${color.border}`,
        alignSelf: "flex-start",
      }}
    >
      {LABELS[status]}
    </span>
  );
}
