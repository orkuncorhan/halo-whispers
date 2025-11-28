// DOSYA: app/components/HaloNav.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  id: "home" | "notifications" | "profile";
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/feed",
  },
  {
    id: "notifications",
    label: "Signals",
    href: "/notifications",
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile", // ← BURASI ARTIK DOĞRU
  },
];

function NavLink({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={[
        "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
        isActive
          ? "bg-slate-900 text-slate-50 shadow-[0_14px_35px_rgba(15,23,42,0.40)]"
          : "text-slate-600 hover:bg-white/80 hover:text-slate-900",
      ].join(" ")}
    >
      {item.label}
    </Link>
  );
}

export function HaloSideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-44 flex-col gap-3 pt-8 pr-4 lg:flex">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return <NavLink key={item.id} item={item} isActive={isActive} />;
      })}
    </aside>
  );
}

export function HaloBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-40 flex justify-center lg:hidden">
      <div className="flex items-center gap-3 rounded-full bg-white/90 px-3 py-2 shadow-[0_18px_45px_rgba(15,23,42,0.25)] backdrop-blur-xl">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-medium transition",
                isActive
                  ? "bg-slate-900 text-slate-50"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}