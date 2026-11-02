import Icon from "./Icon";
import PanelShell from "./PanelShell";
import { PRESETS, THEMES, type RoomState, type SavedLayout } from "./data";

function MiniMap({ state }: { state: RoomState }) {
  const theme = THEMES.find((t) => t.id === state.theme) ?? THEMES[0];
  return (
    <span
      className="relative block h-12 w-16 shrink-0 rounded-lg"
      style={{ backgroundImage: theme.gradient }}
    >
      {Object.values(state.sounds).map((p, i) => (
        <span key={i} className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fire"
          style={{ left: `${p.x}%`, top: `${p.y}%` }} />
      ))}
      <span className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
        style={{ left: `${state.player.x}%`, top: `${state.player.y}%` }} />
    </span>
  );
}

function describe(state: RoomState) {
  const theme = THEMES.find((t) => t.id === state.theme)?.name ?? "";
  return `${Object.keys(state.sounds).length} nguồn âm · ${theme}`;
}

export default function LayoutsPanel({
  saved, onApply, onSave, onDelete, onClose,
}: {
  saved: SavedLayout[];
  onApply: (s: RoomState) => void;
  onSave: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const row = "flex w-full items-center gap-3 rounded-xl border border-line bg-surface-2/60 p-2 text-left hover:border-muted";
  return (
    <PanelShell eyebrow="Không gian" title="Thư viện bố cục" subtitle="Khôi phục theme, vị trí và nguồn âm thanh" onClose={onClose}>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Bố cục có sẵn</p>
      <ul className="space-y-2">
        {PRESETS.map((p) => (
          <li key={p.id}>
            <button type="button" className={row} onClick={() => onApply(p.state)}>
              <MiniMap state={p.state} />
              <span>
                <span className="block text-sm font-semibold">{p.name}</span>
                <span className="block text-xs text-muted">{describe(p.state)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mb-2 mt-5 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Bố cục của bạn</p>
        <button type="button" onClick={onSave} className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover">
          <Icon name="plus" className="size-3.5" /> Lưu hiện tại
        </button>
      </div>
      {saved.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line py-4 text-center text-xs text-muted">
          Chưa có bố cục cá nhân
        </p>
      ) : (
        <ul className="space-y-2">
          {saved.map((s) => (
            <li key={s.id} className="flex items-center gap-2">
              <button type="button" className={row} onClick={() => onApply(s.state)}>
                <MiniMap state={s.state} />
                <span>
                  <span className="block text-sm font-semibold">{s.name}</span>
                  <span className="block text-xs text-muted">{describe(s.state)}</span>
                </span>
              </button>
              <button type="button" onClick={() => onDelete(s.id)} aria-label={`Xóa ${s.name}`}
                className="rounded-lg border border-line p-2 text-muted hover:text-ink">
                <Icon name="close" className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </PanelShell>
  );
}