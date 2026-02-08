import { NextResponse } from "next/server";
import { bridgeFetch } from "@/lib/bridge";

interface Params {
  params: { id: string; jobId: string };
}

export async function POST(_: Request, { params }: Params) {
  try {
    return await bridgeFetch(`/v1/gateways/${params.id}/cron/${params.jobId}/run`, {
      method: "POST"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
