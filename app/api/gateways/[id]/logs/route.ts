import { NextResponse } from "next/server";
import { bridgeFetch } from "@/lib/bridge";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit") ?? "200";
    return await bridgeFetch(`/v1/gateways/${params.id}/logs?limit=${limit}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
