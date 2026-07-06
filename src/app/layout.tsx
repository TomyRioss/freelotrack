import type { Metadata } from "next";
import { SessionProvider } from "./session-provider";
import AppShell from "./app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreeloTrack",
  description: "Gestión de proyectos freelance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <SessionProvider>
          <AppShell>{children}</AppShell>
        </SessionProvider>
      </body>
    </html>
  );
}
