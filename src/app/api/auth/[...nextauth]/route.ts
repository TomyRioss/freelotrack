import { handlers } from "@/lib/auth";
import { NextRequest } from "next/server";

// Next.js 16 passes two args to route handlers, NextAuth v5 expects one.
// We accept both but only pass the request to NextAuth.
async function handleGET(
  request: NextRequest,
  context?: { params: Promise<{ nextauth: string[] }> }
) {
  return handlers.GET(request);
}

async function handlePOST(
  request: NextRequest,
  context?: { params: Promise<{ nextauth: string[] }> }
) {
  return handlers.POST(request);
}

export const GET = handleGET;
export const POST = handlePOST;
