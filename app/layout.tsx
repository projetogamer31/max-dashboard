import "./globals.css";
import TopNav from "@/components/TopNav";

export const metadata = {
  title: "Mission Control",
  description: "OpenClaw Mission Control dashboard"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
