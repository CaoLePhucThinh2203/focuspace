"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/workspace", label: "Workspace" },
  { href: "/about", label: "Giới thiệu" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      pathname === href
        ? "bg-surface text-accent"
        : "text-muted hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
          <span className="grid size-8 place-items-center rounded-lg bg-accent text-bg">F</span>
          FocusSpace
        </Link>

        {/* Desktop */}
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}
              aria-current={pathname === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
          <Link href="/login"
            className="ml-3 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover">
            Đăng nhập
          </Link>
        </nav>

        {/* Nút menu mobile */}
        <button type="button" className="rounded-lg p-2 text-ink md:hidden"
          aria-label="Mở menu" aria-expanded={open} aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}>
          <span className="block text-2xl leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav id="mobile-menu" aria-label="Điều hướng di động"
          className="flex flex-col gap-1 border-t border-line px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)}
            className="mt-2 rounded-lg bg-accent px-4 py-2 text-center text-sm font-semibold text-bg">
            Đăng nhập
          </Link>
        </nav>
      )}
    </header>
  );
}