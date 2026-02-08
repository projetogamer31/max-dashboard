import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function Card({ title, children, action }: CardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-mc-card p-6 shadow-lg shadow-black/20">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
