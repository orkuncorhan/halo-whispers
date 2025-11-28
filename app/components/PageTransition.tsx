"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [renderKey, setRenderKey] = useState(pathname);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // pathname değiştiğinde küçük bir fade-in animasyonu için key değiştiriyoruz
    setRenderKey(pathname);
    setReady(false);

    const t = setTimeout(() => {
      setReady(true);
    }, 10);

    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div
      key={renderKey}
      className={`transition-all duration-400 ease-out 
        ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
    >
      {children}
    </div>
  );
}
