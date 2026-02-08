import { NextResponse } from "next/server";
import { bridgeFetchJson } from "@/lib/bridge";
import type { GatewayLog } from "@/lib/types";

interface Params {
  params: { id: string };
}

type BridgeLogsResponse = {
  lines?: string[];
} | string[];

function parseLine(line: string): GatewayLog {
  // Common log format: "2026-... level msg ..." or JSON.
  const trimmed = line.trim();
  if (trimmed.startsWith("{")) {
    try {
      const obj = JSON.parse(trimmed);
      return {
        ts: String(obj.time ?? obj.ts ?? ""),
        level: String(obj.level ?? "info"),
        message: String(obj.msg ?? obj.message ?? trimmed)
      };
    } catch {
      // fallthrough
    }
  }

  const m = trimmed.match(/^(\d{4}-\d{2}-\d{2}T[^\s]+)\s+(\w+)\s+(.*)$/);
  if (m) {
    return { ts: m[1], level: m[2], message: m[3] };
  }
  return { ts: "", level: "info", message: trimmed };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit") ?? "200";
    const data = await bridgeFetchJson<BridgeLogsResponse>(`/v1/gateways/${params.id}/logs?limit=${limit}`);
    const lines = Array.isArray(data) ? data : data?.lines ?? [];
    const logs: GatewayLog[] = lines.map(parseLine);
    return NextResponse.json(logs);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
