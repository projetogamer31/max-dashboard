import { NextResponse } from "next/server";
import { bridgeFetchJson } from "@/lib/bridge";
import type { SessionInfo } from "@/lib/types";

interface Params {
  params: { id: string };
}

type BridgeSessionsResponse = {
  sessions?: any[];
} | any[];

export async function GET(_: Request, { params }: Params) {
  try {
    const data = await bridgeFetchJson<BridgeSessionsResponse>(`/v1/gateways/${params.id}/sessions`);
    const itemsRaw = Array.isArray(data) ? data : data?.sessions ?? [];

    const sessions: SessionInfo[] = itemsRaw.map((s: any) => ({
      id: String(s.key ?? s.sessionKey ?? s.id ?? ""),
      user: s.user ?? s.peer ?? s.key ?? "",
      status: s.kind ?? s.status ?? "",
      tokensUsed: typeof s.totalTokens === "number" ? s.totalTokens : typeof s.tokensUsed === "number" ? s.tokensUsed : undefined,
      startedAt: typeof s.updatedAt === "number" ? new Date(s.updatedAt).toISOString() : s.startedAt,
      contextBytes: typeof s.contextTokens === "number" ? s.contextTokens : typeof s.contextBytes === "number" ? s.contextBytes : undefined
    }));

    return NextResponse.json(sessions);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
