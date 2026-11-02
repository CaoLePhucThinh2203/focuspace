"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import DragNode from "./DragNode";
import Icon, { type IconName } from "./Icon";
import LayoutsPanel from "./LayoutsPanel";
import PomodoroPanel, { usePomodoro } from "./PomodoroPanel";
import SoundsPanel from "./SoundsPanel";
import ThemesPanel from "./ThemesPanel";
import { useSpatialAudio } from "./useSpatialAudio";
import {
  DEFAULT_STATE, SOUNDS, THEMES, distanceRatio, volumeOf, zoneOf,
  type Pos, type RoomState, type SavedLayout, type SoundId, type Zone,
} from "./data";

type PanelId = "sounds" | "theme" | "layout" | "pomodoro";
const ROOM_KEY = "focuspace:room";
const LAYOUTS_KEY = "focuspace:layouts";

const TOOLS: { id: PanelId; label: string; icon: IconName }[] = [
  { id: "sounds", label: "Âm thanh", icon: "volume" },
  { id: "theme", label: "Theme", icon: "image" },
  { id: "layout", label: "Bố cục", icon: "layout" },
  { id: "pomodoro", label: "Pomodoro", icon: "timer" },
];

const SLOTS: Pos[] = [
  { x: 25, y: 30 }, { x: 72, y: 30 }, { x: 22, y: 76 }, { x: 76, y: 72 }, { x: 50, y: 20 },
];

const ZONE_STYLE: Record<Zone, string> = {
  near: "border-success text-success shadow-lg shadow-success/40",
  mid: "border-fire text-fire shadow-lg shadow-fire/30",
  far: "border-muted/60 text-muted",
};

export default function Workspace() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState<RoomState>(DEFAULT_STATE);
  const [saved, setSaved] = useState<SavedLayout[]>([]);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const pomo = usePomodoro();

  /* Đọc dữ liệu đã lưu */
  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem(ROOM_KEY) ?? "null");
      if (r?.theme && r?.player && r?.sounds) setRoom(r);
      const l = JSON.parse(localStorage.getItem(LAYOUTS_KEY) ?? "null");
      if (Array.isArray(l)) setSaved(l);
    } catch {}
    setLoaded(true);
  }, []);

  /* Tự lưu */
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(ROOM_KEY, JSON.stringify(room));
  }, [room, loaded]);
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(LAYOUTS_KEY, JSON.stringify(saved));
  }, [saved, loaded]);

  /* Theo dõi kích thước khung cảnh */
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setSize({ w: e.contentRect.width, h: e.contentRect.height }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const activeIds = useMemo(() => Object.keys(room.sounds) as SoundId[], [room.sounds]);

  const ratios = useMemo(() => {
    const r: Partial<Record<SoundId, number>> = {};
    for (const id of activeIds) {
      const p = room.sounds[id];
      if (p) r[id] = distanceRatio(p, room.player, size.w, size.h);
    }
    return r;
  }, [activeIds, room, size]);

  const volumes = useMemo(() => {
    const v: Partial<Record<SoundId, number>> = {};
    for (const id of activeIds) v[id] = volumeOf(ratios[id] ?? 0);
    return v;
  }, [activeIds, ratios]);

  useSpatialAudio(volumes, started);

  /* Hành động */
  const movePlayer = (p: Pos) => setRoom((r) => ({ ...r, player: p }));
  const moveSound = (id: SoundId, p: Pos) =>
    setRoom((r) => ({ ...r, sounds: { ...r.sounds, [id]: p } }));
  const toggleSound = (id: SoundId) =>
    setRoom((r) => {
      const sounds = { ...r.sounds };
      if (sounds[id]) delete sounds[id];
      else sounds[id] = SLOTS[Object.keys(sounds).length % SLOTS.length];
      return { ...r, sounds };
    });
  const saveLayout = () =>
    setSaved((prev) => [...prev, { id: Date.now().toString(36), name: `Bố cục ${prev.length + 1}`, state: room }]);

  const theme = THEMES.find((t) => t.id === room.theme) ?? THEMES[0];

  return (
    <div
      className="relative h-dvh w-full overflow-hidden bg-bg"
      onPointerDownCapture={() => !started && setStarted(true)} // trình duyệt cần một cú chạm trước khi phát âm
    >
      {/* Nền */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${theme.image}), ${theme.gradient}`, imageRendering: "pixelated" }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-bg/40 via-transparent to-bg/50" />

      {/* Khung cảnh: nơi kéo thả */}
      <div ref={sceneRef} className="absolute inset-0 z-10">
        {activeIds.map((id) => {
          const p = room.sounds[id];
          const sound = SOUNDS.find((s) => s.id === id);
          if (!p || !sound) return null;
          const zone = zoneOf(ratios[id] ?? 0);
          return (
            <DragNode key={id} pos={p} containerRef={sceneRef} label={sound.name}
              ariaLabel={`${sound.name}. Dùng phím mũi tên để di chuyển`}
              onMove={(np) => moveSound(id, np)}>
              <span className={`grid size-11 place-items-center rounded-xl border-2 bg-surface/80 text-[11px] font-bold backdrop-blur ${ZONE_STYLE[zone]}`}>
                {sound.code}
              </span>
            </DragNode>
          );
        })}

        <DragNode pos={room.player} containerRef={sceneRef} label="Bạn"
          ariaLabel="Nhân vật. Dùng phím mũi tên để di chuyển" onMove={movePlayer}>
          <span className="flex flex-col items-center" aria-hidden="true">
            <span className="size-4 rounded-sm bg-[#f0c9a0] ring-2 ring-[#3a2a22]" />
            <span className="-mt-0.5 h-5 w-7 rounded-sm bg-accent" />
          </span>
        </DragNode>
      </div>

      {/* Công cụ */}
      <nav aria-label="Công cụ" className="absolute left-4 top-4 z-30 flex gap-2">
        {TOOLS.map((t) => (
          <button key={t.id} type="button" aria-label={t.label} aria-pressed={panel === t.id}
            onClick={() => setPanel(panel === t.id ? null : t.id)}
            className={`grid size-11 place-items-center rounded-xl border transition-colors ${
              panel === t.id ? "border-accent bg-accent text-bg" : "border-line bg-surface/70 text-muted backdrop-blur hover:text-ink"
            }`}>
            <Icon name={t.icon} />
          </button>
        ))}
        <Link href="/" aria-label="Về trang chủ"
          className="grid size-11 place-items-center rounded-xl border border-line bg-surface/70 text-muted backdrop-blur hover:text-ink">
          <Icon name="home" />
        </Link>
      </nav>

      {/* Trạng thái */}
      <p className="absolute right-4 top-4 z-20 hidden items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 text-xs backdrop-blur sm:flex">
        <span className="size-2 rounded-full bg-success" />
        {activeIds.length} nguồn âm đang hoạt động · {theme.name}
      </p>

      {/* Bảng */}
      {panel === "sounds" && <SoundsPanel active={activeIds} onToggle={toggleSound} onClose={() => setPanel(null)} />}
      {panel === "theme" && <ThemesPanel theme={room.theme} onSelect={(t) => setRoom((r) => ({ ...r, theme: t }))} onClose={() => setPanel(null)} />}
      {panel === "layout" && (
        <LayoutsPanel saved={saved} onApply={setRoom} onSave={saveLayout}
          onDelete={(id) => setSaved((s) => s.filter((x) => x.id !== id))} onClose={() => setPanel(null)} />
      )}
      {panel === "pomodoro" && <PomodoroPanel pomo={pomo} onClose={() => setPanel(null)} />}

      {/* Chú thích */}
      <ul className="absolute bottom-4 left-4 z-20 flex items-center gap-3 rounded-full border border-line bg-surface/80 px-3 py-1.5 text-[11px] text-muted backdrop-blur">
        <li className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" />Gần</li>
        <li className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-fire" />Trung bình</li>
        <li className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-muted" />Xa</li>
      </ul>
      <p className="absolute bottom-4 right-4 z-20 hidden rounded-full bg-surface/80 px-3 py-1.5 text-[11px] text-muted backdrop-blur sm:block">
        Kéo nhân vật và nguồn âm để điều chỉnh
      </p>
    </div>
  );
}