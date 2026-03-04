"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Logo } from "@/components/Logo";

const navItems = [
  { href: "/dashboard", label: "Accueil", icon: "◉" },
  { href: "/campaigns", label: "Mes Campagnes", icon: "▣" },
  { href: "/announcements", label: "Annonces", icon: "◈" },
  { href: "/job-listings", label: "Offres d'emploi", icon: "◇" },
  { href: "/reel", label: "Reel", icon: "▶" },
  { href: "/admin", label: "Admin", icon: "⚙", adminOnly: true },
  { href: "/account", label: "Mon Compte", icon: "○" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin === true;
  const items = navItems.filter((item) => !("adminOnly" in item && item.adminOnly) || isAdmin);

  return (
    <aside className="w-52 flex flex-col shrink-0 bg-[#0c0c1a] border-r border-white/10 text-slate-200">
      <div className="p-5 border-b border-white/10 flex flex-col items-center">
        <Link href="/dashboard" className="flex items-center justify-center gap-2 text-lg [&_span]:text-white">
          <Logo variant="full" size={28} />
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base opacity-80">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-white/10 space-y-1">
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:bg-white/5 hover:text-white text-sm"
        >
          <span>↪</span>
          <span>Déconnexion</span>
        </Link>
      </div>
    </aside>
  );
}
