import Image from "next/image";
import Link from "next/link";

const steps = [
  { n: "01", title: "Chọn âm thanh", text: "Mưa, lửa trại, quán cà phê, sóng biển, gió, hoặc tự thêm âm thanh của riêng bạn." },
  { n: "02", title: "Kéo thả vào phòng", text: "Đặt các nguồn âm quanh bạn. Kéo càng gần thì âm lượng càng lớn, càng xa thì càng nhỏ." },
  { n: "03", title: "Tập trung", text: "Lưu bố cục, bật Pomodoro và làm việc trong không gian của riêng mình." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            White noise &amp; âm thanh môi trường
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            Tập trung theo cách riêng.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Tự chọn, kết hợp và sắp xếp các nguồn âm để tạo môi trường phù hợp với bạn.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/workspace"
              className="rounded-xl bg-accent px-6 py-3 font-semibold text-bg transition-colors hover:bg-accent-hover">
              Vào Workspace
            </Link>
            <Link href="/about"
              className="rounded-xl border border-line px-6 py-3 font-semibold transition-colors hover:bg-surface">
              Tìm hiểu thêm
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-2xl">
          <Image src="/images/hero.webp" alt="Giao diện Workspace của FocusSpace"
            width={960} height={660} priority className="h-auto w-full rounded-xl" />
        </div>
      </section>

      {/* 3 bước */}
      <section className="border-y border-line bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Chỉ 3 bước để bắt đầu</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="rounded-2xl border border-line bg-surface p-6">
                <span className="text-sm font-bold text-accent">{s.n}</span>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA cuối trang */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">Sẵn sàng tạo không gian của bạn?</h2>
        <Link href="/workspace"
          className="mt-6 inline-block rounded-xl bg-accent px-8 py-3 font-semibold text-bg transition-colors hover:bg-accent-hover">
          Bắt đầu ngay
        </Link>
      </section>
    </>
  );
}