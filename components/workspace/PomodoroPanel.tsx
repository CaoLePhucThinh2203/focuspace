"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import PanelShell from "./PanelShell";

export type PomodoroMode = "focus" | "break";

/** Trạng thái nằm ở Workspace để đồng hồ vẫn chạy khi đóng bảng. */
export function usePomodoro() {
  const [mode, setMode] = useState<PomodoroMode>("focus");
  const [minutes, setMinutes] = useState({ focus: 25, break: 5 });
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const endAt = useRef(0);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      const left = Math.ceil((endAt.current - Date.now()) / 1000);
      if (left > 0) {
        setRemaining(left);
        return;
      }
      const next: PomodoroMode = mode === "focus" ? "break" : "focus";
      if (mode === "focus") setCompleted((c) => c + 1);
      setRunning(false);
      setMode(next);
      setRemaining(minutes[next] * 60);
    }, 250);
    return () => clearInterval(timer);
  }, [running, mode, minutes]);

  const start = () => {
    endAt.current = Date.now() + remaining * 1000;
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setRemaining(minutes[mode] * 60);
  };
  const switchMode = (m: PomodoroMode) => {
    setRunning(false);
    setMode(m);
    setRemaining(minutes[m] * 60);
  };
  const setDuration = (m: PomodoroMode, value: number) => {
    const v = Math.min(120, Math.max(1, Math.round(value) || 1));
    setMinutes((prev) => ({ ...prev, [m]: v }));
    if (!running && m === mode) setRemaining(v * 60);
  };

  return { mode, minutes, remaining, running, completed, start, pause, reset, switchMode, setDuration };
}

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function PomodoroPanel({
  pomo, onClose,
}: {
  pomo: ReturnType<typeof usePomodoro>;
  onClose: () => void;
}) {
  const total = pomo.minutes[pomo.mode] * 60;
  const R = 70;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - pomo.remaining / total);

  const tab = (m: PomodoroMode, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={pomo.mode === m}
      onClick={() => pomo.switchMode(m)}
      className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
        pomo.mode === m ? "bg-accent/20 text-accent" : "text-muted hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  const field = (m: PomodoroMode, label: string) => (
    <label className="block text-xs text-muted">
      {label}
      <input
        type="number" min={1} max={120}
        value={pomo.minutes[m]}
        onChange={(e) => pomo.setDuration(m, Number(e.target.value))}
        className="mt-1 w-full rounded-lg border border-line bg-bg/60 px-3 py-2 text-sm text-ink"
      />
    </label>
  );

  return (
    <PanelShell eyebrow="Công cụ tập trung" title="Pomodoro" onClose={onClose}>
      <div role="tablist" className="flex gap-1 rounded-xl border border-line bg-bg/40 p-1">
        {tab("focus", "Tập trung")}
        {tab("break", "Nghỉ ngơi")}
      </div>

      <div className="relative mx-auto my-5 size-40">
        <svg viewBox="0 0 160 160" className="size-40 -rotate-90" aria-hidden="true">
          <circle cx="80" cy="80" r={R} className="fill-none stroke-line" strokeWidth="6" />
          <circle cx="80" cy="80" r={R} className="fill-none stroke-accent" strokeWidth="6"
            strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset} />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <p className="text-3xl font-bold tabular-nums" role="timer" aria-live="off">{fmt(pomo.remaining)}</p>
          <p className="text-[11px] text-muted">{pomo.mode === "focus" ? "Giữ nhịp tập trung" : "Thư giãn một chút"}</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-line bg-bg/40 px-3 py-2 text-sm">
        <span className="text-muted">Phiên hoàn thành</span>
        <span className="font-bold">{pomo.completed}</span>
      </div>

      <div className="mt-3 flex gap-2">
        <button type="button" onClick={pomo.running ? pomo.pause : pomo.start}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-bg hover:bg-accent-hover">
          <Icon name={pomo.running ? "pause" : "play"} className="size-4" />
          {pomo.running ? "Tạm dừng" : "Bắt đầu"}
        </button>
        <button type="button" onClick={pomo.reset} aria-label="Đặt lại"
          className="rounded-xl border border-line px-4 text-muted hover:text-ink">
          <Icon name="reset" className="size-4" />
        </button>
      </div>

      <p className="mb-2 mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Tùy chỉnh thời gian</p>
      <div className="grid grid-cols-2 gap-3">
        {field("focus", "Tập trung (phút)")}
        {field("break", "Nghỉ ngơi (phút)")}
      </div>
    </PanelShell>
  );
}