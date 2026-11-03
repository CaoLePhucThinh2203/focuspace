import Link from "next/link";
import Icon from "./Icon";
import PanelShell from "./PanelShell";
import { SOUNDS, type SoundId } from "./data";

export default function SoundsPanel({
  active, onToggle, onClose,
}: {
  active: SoundId[];
  onToggle: (id: SoundId) => void;
  onClose: () => void;
}) {
  return (
    <PanelShell eyebrow="Thư viện" title="Âm thanh" subtitle="Kéo một nguồn âm vào không gian" onClose={onClose}>
      <ul className="space-y-2">
        {SOUNDS.map((s) => {
          const on = active.includes(s.id);
          return (
            <li key={s.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onToggle(s.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                  on ? "border-accent/60 bg-accent/10" : "border-line bg-surface-2/60 hover:border-muted"
                }`}
              >
                <span className="grid size-9 place-items-center rounded-lg bg-bg/60 text-[11px] font-bold">{s.code}</span>
                <span>
                  <span className="block text-sm font-semibold">{s.name}</span>
                  <span className={`block text-xs ${on ? "text-accent" : "text-muted"}`}>
                    {on ? "Đang phát" : "Thêm vào phòng"}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <Link
        href="/sounds/new"
        className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-line py-3 text-sm text-muted hover:text-ink"
      >
        <Icon name="plus" className="size-4" /> Thêm âm thanh mới
      </Link>
    </PanelShell>
  );
}