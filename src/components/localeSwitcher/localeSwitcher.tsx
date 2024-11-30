"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newLocale = event.target.value;

      // Get the path without the locale
      const pathWithoutLocale = pathname.split("/").slice(2).join("/");

      // Construct new path with selected locale
      const newPath = `/${newLocale}/${pathWithoutLocale}`;

      router.push(newPath);
    },
    [pathname, router]
  );

  return (
    <select
      onChange={onSelectChange}
      value={pathname.split("/")[1]}
      className="bg-transparent border rounded px-2 py-1"
    >
      {routing.locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
