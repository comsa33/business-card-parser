"use client";

import { GraduationCap } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-primary)] text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 shrink-0">
          <GraduationCap size={24} className="text-[var(--color-accent)]" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold leading-tight truncate">
            aSSIST AI PhD.
          </h1>
          <p className="text-xs text-white/70 leading-tight">
            202603 기수 연락처 공유
          </p>
        </div>
      </div>
    </header>
  );
}
