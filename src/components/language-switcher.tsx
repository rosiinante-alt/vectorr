"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const m = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
    if (m) setLocale(decodeURIComponent(m[1]));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    if (!v || v === "en") return;
    // Locale other than English is not live yet — options are disabled in the
    // select so this handler is a no-op for now.
  }

  return (
    <div
      className="flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-2 text-text-tertiary transition-colors hover:bg-[rgba(0,0,0,0.045)] hover:text-text-primary"
      title="Language"
    >
      <Globe className="h-3.5 w-3.5" />
      <select
        value={locale}
        onChange={handleChange}
        aria-label="Language"
        className="cursor-pointer appearance-none bg-transparent text-[13px] text-text-secondary outline-none"
      >
        <option value="en">EN</option>
        <option value="es" disabled>ES — soon</option>
        <option value="de" disabled>DE — soon</option>
        <option value="fr" disabled>FR — soon</option>
      </select>
    </div>
  );
}
