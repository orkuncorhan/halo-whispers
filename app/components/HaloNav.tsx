// DOSYA: app/components/HaloNav.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import GlowHaloLogo from "@/app/components/GlowHaloLogo";

type NavItem = {
  id: "home" | "notifications" | "profile" | "settings";
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
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
  },
];

function NavLink({
  item,
  isActive,
  label,
}: {
  item: NavItem;
  isActive: boolean;
  label: string;
}) {
  const baseItem =
    "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors duration-150";
  const activeItem =
    "bg-slate-900 text-slate-50 shadow-[0_14px_35px_rgba(15,23,42,0.40)] dark:bg-slate-100 dark:text-slate-900";
  const inactiveItem =
    "text-slate-600 hover:bg-white/80 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/70";

  return (
    <Link
      href={item.href}
      className={[baseItem, isActive ? activeItem : inactiveItem].join(" ")}
    >
      {label}
    </Link>
  );
}

export function HaloSideNav() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isTR = language === "tr";

  const labelMap: Record<NavItem["id"], string> = {
    home: isTR ? "Akış" : "Feed",
    notifications: isTR ? "Sinyaller" : "Signals",
    profile: isTR ? "Profil" : "Profile",
    settings: isTR ? "Ayarlar" : "Settings",
  };

  return (
    <aside className="hidden w-44 flex-col gap-3 pt-8 pr-4 lg:flex">
      <div className="flex items-center gap-2 pl-1 text-slate-800 dark:text-slate-100">
        <GlowHaloLogo size={28} />
        <span className="text-sm font-semibold tracking-tight">
          Halo
        </span>
      </div>

      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <NavLink
            key={item.id}
            item={item}
            isActive={isActive}
            label={labelMap[item.id]}
          />
        );
      })}
    </aside>
  );
}

export function HaloBottomNav() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isTR = language === "tr";

  const labelMap: Record<NavItem["id"], string> = {
    home: isTR ? "Akış" : "Feed",
    notifications: isTR ? "Sinyaller" : "Signals",
    profile: isTR ? "Profil" : "Profile",
    settings: isTR ? "Ayarlar" : "Settings",
  };

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-40 flex justify-center lg:hidden">
      <div className="flex items-center gap-3 rounded-full bg-white/90 px-3 py-2 shadow-[0_18px_45px_rgba(15,23,42,0.25)] backdrop-blur-xl">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const baseItem =
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150";
          const activeItem =
            "bg-slate-900 text-slate-50 shadow-[0_12px_30px_rgba(15,23,42,0.35)] dark:bg-slate-100 dark:text-slate-900";
          const inactiveItem =
            "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/70";

          return (
            <Link
              key={item.id}
              href={item.href}
              className={[baseItem, isActive ? activeItem : inactiveItem].join(
                " "
              )}
            >
              {labelMap[item.id]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
