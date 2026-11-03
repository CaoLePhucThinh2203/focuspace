import PanelShell from "./PanelShell";
import { THEMES, type ThemeId } from "./data";

export default function ThemesPanel({
  theme, onSelect, onClose,
}: {
  theme: ThemeId;
  onSelect: (id: ThemeId) => void;
  onClose: () => void;
}) {
  return (
    <PanelShell eyebrow="Không gian" title="Background theme" subtitle="Chọn sắc thái cho không gian tập trung" onClose={onClose}>
      <ul className="space-y-2">
        {THEMES.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              aria-pressed={theme === t.id}
              onClick={() => onSelect(t.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors ${
                theme === t.id ? "border-accent/60 bg-accent/10" : "border-line bg-surface-2/60 hover:border-muted"
              }`}
            >
              <span
                className="h-12 w-16 shrink-0 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${t.image}), ${t.gradient}` }}
              />
              <span>
                <span className="block text-sm font-semibold">{t.name}</span>
                <span className="block text-xs text-muted">{t.desc}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}