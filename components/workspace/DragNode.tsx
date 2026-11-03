"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import type { Pos } from "./data";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

type Props = {
  pos: Pos;
  onMove: (p: Pos) => void;
  containerRef: RefObject<HTMLDivElement | null>;
  label: string;
  ariaLabel: string;
  children: ReactNode;
};

export default function DragNode({ pos, onMove, containerRef, label, ariaLabel, children }: Props) {
  const dragging = useRef(false);

  const place = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    onMove({
      x: clamp(((e.clientX - rect.left) / rect.width) * 100, 4, 96),
      y: clamp(((e.clientY - rect.top) / rect.height) * 100, 8, 92),
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 2;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0], ArrowRight: [step, 0],
      ArrowUp: [0, -step], ArrowDown: [0, step],
    };
    const d = delta[e.key];
    if (!d) return;
    e.preventDefault();
    onMove({ x: clamp(pos.x + d[0], 4, 96), y: clamp(pos.y + d[1], 8, 92) });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none select-none flex-col items-center gap-1 rounded-xl active:cursor-grabbing"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => dragging.current && place(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      onKeyDown={onKeyDown}
    >
      {children}
      <span className="rounded bg-bg/80 px-1.5 py-0.5 text-[10px] font-semibold">{label}</span>
    </div>
  );
}