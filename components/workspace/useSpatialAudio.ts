"use client";

import { useEffect, useRef } from "react";
import { SOUNDS, type SoundId } from "./data";

/** Phát lặp các nguồn âm đang bật, âm lượng lấy từ `volumes`. */
export function useSpatialAudio(
  volumes: Partial<Record<SoundId, number>>,
  started: boolean,
) {
  const audios = useRef<Map<SoundId, HTMLAudioElement>>(new Map());
  const ids = Object.keys(volumes) as SoundId[];
  const key = ids.join(",");

  // Bật/tắt nguồn âm khi danh sách thay đổi
  useEffect(() => {
    const map = audios.current;
    for (const [id, audio] of map) {
      if (!ids.includes(id)) {
        audio.pause();
        map.delete(id);
      }
    }
    if (!started) return;
    for (const id of ids) {
      if (map.has(id)) continue;
      const sound = SOUNDS.find((s) => s.id === id);
      if (!sound) continue;
      const audio = new Audio(sound.src);
      audio.loop = true;
      audio.volume = volumes[id] ?? 0;
      audio.play().catch(() => {}); // chưa có file hoặc trình duyệt chặn
      map.set(id, audio);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, started]);

  // Cập nhật âm lượng khi kéo
  useEffect(() => {
    for (const [id, audio] of audios.current) audio.volume = volumes[id] ?? 0;
  });

  // Dừng hết khi rời trang
  useEffect(() => {
    const map = audios.current;
    return () => {
      map.forEach((a) => a.pause());
      map.clear();
    };
  }, []);
}