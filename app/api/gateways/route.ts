import { NextResponse } from "next/server";
import { bridgeFetch } from "@/lib/bridge";

export async function GET() {
  try {
    return await bridgeFetch("/v1/gateways");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
