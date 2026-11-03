import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold">FocuSpace</p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            Không gian âm thanh cá nhân hóa cho học tập và làm việc tập trung.
          </p>
        </div>
        <nav aria-label="Liên kết nhanh">
          <p className="text-sm font-semibold">Khám phá</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/workspace" className="hover:text-ink">Workspace</Link></li>
            <li><Link href="/about" className="hover:text-ink">Giới thiệu</Link></li>
            <li><Link href="/login" className="hover:text-ink">Đăng nhập</Link></li>
          </ul>
        </nav>
        <div>
          <p className="text-sm font-semibold">Dự án</p>
          <p className="mt-3 text-sm text-muted">
            Đồ án môn Web Design and Development – VNUK
          </p>
        </div>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">
        © 2026 FocusSpace. Bảo lưu mọi quyền.
      </p>
    </footer>
  );
}