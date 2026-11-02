export type SoundId = "rain" | "fire" | "cafe" | "wave" | "wind";
export type ThemeId = "snow" | "mist" | "dawn";
export type Pos = { x: number; y: number }; // phần trăm trong khung cảnh

export type RoomState = {
  theme: ThemeId;
  player: Pos;
  sounds: Partial<Record<SoundId, Pos>>;
};
export type SavedLayout = { id: string; name: string; state: RoomState };

export type Sound = { id: SoundId; name: string; code: string; src: string };
export const SOUNDS: Sound[] = [
  { id: "rain", name: "Mưa đêm", code: "RN", src: "/audio/rain.mp3" },
  { id: "fire", name: "Lửa trại", code: "FR", src: "/audio/campfire.mp3" },
  { id: "cafe", name: "Quán cà phê", code: "CF", src: "/audio/cafe.mp3" },
  { id: "wave", name: "Sóng biển", code: "WV", src: "/audio/waves.mp3" },
  { id: "wind", name: "Gió nhẹ", code: "WD", src: "/audio/wind.mp3" },
];

export type Theme = {
  id: ThemeId;
  name: string;
  desc: string;
  image: string;
  gradient: string; // hiện khi chưa có ảnh nền
};
export const THEMES: Theme[] = [
  {
    id: "snow", name: "Đêm tuyết", desc: "Xanh đêm yên tĩnh",
    image: "/themes/snow.webp",
    gradient: "linear-gradient(180deg,#0a1626 0%,#14304d 60%,#0b1a2b 100%)",
  },
  {
    id: "mist", name: "Sương lam", desc: "Dịu nhẹ và tối giản",
    image: "/themes/mist.webp",
    gradient: "linear-gradient(180deg,#1a2a3a 0%,#3a5368 60%,#1d2d3d 100%)",
  },
  {
    id: "dawn", name: "Bình minh", desc: "Ấm áp và thư giãn",
    image: "/themes/dawn.webp",
    gradient: "linear-gradient(180deg,#1d2b2a 0%,#4b6b54 60%,#233a30 100%)",
  },
];

export const DEFAULT_STATE: RoomState = {
  theme: "snow",
  player: { x: 50, y: 62 },
  sounds: {
    rain: { x: 25, y: 28 },
    fire: { x: 68, y: 30 },
    wave: { x: 20, y: 76 },
    cafe: { x: 75, y: 72 },
  },
};

export const PRESETS: { id: string; name: string; state: RoomState }[] = [
  {
    id: "deep", name: "Tập trung sâu",
    state: { theme: "snow", player: { x: 50, y: 62 }, sounds: { rain: { x: 30, y: 35 }, fire: { x: 68, y: 40 } } },
  },
  {
    id: "morning", name: "Buổi sáng dịu",
    state: { theme: "mist", player: { x: 50, y: 62 }, sounds: { wave: { x: 25, y: 70 }, wind: { x: 72, y: 38 } } },
  },
  {
    id: "warm", name: "Tối ấm áp",
    state: { theme: "dawn", player: { x: 50, y: 62 }, sounds: { fire: { x: 35, y: 60 }, cafe: { x: 70, y: 68 } } },
  },
];

/* ---------- Khoảng cách và âm lượng ---------- */
export type Zone = "near" | "mid" | "far";

// Khoảng cách chuẩn hóa theo đường chéo khung cảnh (0 đến 1)
export function distanceRatio(a: Pos, b: Pos, w: number, h: number) {
  const diag = Math.hypot(w, h) || 1;
  return Math.hypot(((a.x - b.x) / 100) * w, ((a.y - b.y) / 100) * h) / diag;
}
export function zoneOf(ratio: number): Zone {
  return ratio < 0.2 ? "near" : ratio < 0.4 ? "mid" : "far";
}
export function volumeOf(ratio: number) {
  return Math.min(1, Math.max(0.03, 1 - ratio / 0.6));
}