import type { ReactNode } from "react";
import Icon from "./Icon";

export default function PanelShell({
  eyebrow, title, subtitle, onClose, children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className="absolute left-4 top-19 z-30 flex max-h-[calc(100dvh-6.5rem)] w-76 flex-col rounded-2xl border border-line bg-surface/95 p-4 shadow-2xl backdrop-blur max-sm:inset-x-3 max-sm:bottom-3 max-sm:top-auto max-sm:max-h-[65dvh] max-sm:w-auto"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{eyebrow}</p>
          <h2 className="mt-1 text-lg font-bold">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng bảng"
          className="rounded-lg border border-line p-1.5 text-muted hover:text-ink"
        >
          <Icon name="close" className="size-4" />
        </button>
      </div>
      <div className="mt-4 overflow-y-auto pr-1">{children}</div>
    </section>
  );
}