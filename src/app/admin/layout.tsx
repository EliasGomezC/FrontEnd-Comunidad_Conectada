"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const ready = useSyncExternalStore(
    () => () => undefined,
    () => localStorage.getItem("comunidad-conectada-auth") === "true",
    () => false,
  );

  useEffect(() => {
    if (!ready) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, ready, router]);

  if (!ready) {
    return <div className="min-h-screen bg-[#dfe5eb]" aria-busy="true" />;
  }

  return children;
}
