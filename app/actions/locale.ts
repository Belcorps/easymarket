"use server";

import { cookies } from "next/headers";
import { COOKIE_NAME, type Locale } from "@/lib/i18n";

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
