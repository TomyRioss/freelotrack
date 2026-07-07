"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email o contraseña incorrectos");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="40" y="40" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="#f1f1f7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Glow effect behind card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Login card */}
      <Card className="relative w-full max-w-md bg-card border border-border shadow-2xl animate-fade-in animate-slide-up">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-10 blur" />
        <div className="relative">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ✨ FreeloTrack
            </CardTitle>
            <CardDescription className="text-muted text-sm">Inicia sesión para gestionar tus proyectos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tomas@freelotrack.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-surface border-border text-foreground placeholder:text-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground text-sm font-medium">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-surface border-border text-foreground placeholder:text-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              {error && (
                <p className="text-destructive text-sm text-center font-medium bg-destructive/10 rounded-lg py-2">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary text-foreground font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
