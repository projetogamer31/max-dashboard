import Link from "next/link";

const links = [
  { href: "/", label: "Overview" },
  { href: "/cron", label: "Cron" },
  { href: "/sessions", label: "Sessions" },
  { href: "/logs", label: "Logs" }
];

export default function TopNav() {
  return (
    <header className="border-b border-white/10 bg-mc-panel/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-mc-muted">OpenClaw</p>
          <p className="text-xl font-semibold">Mission Control</p>
        </div>
        <nav className="flex gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-mc-accent hover:text-mc-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
