import { NextResponse } from "next/server";
import { bridgeFetch } from "@/lib/bridge";

interface Params {
  params: { id: string };
}

export async function GET(_: Request, { params }: Params) {
  try {
    return await bridgeFetch(`/v1/gateways/${params.id}/cron`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
