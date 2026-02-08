import { NextResponse } from "next/server";
import { bridgeFetchJson } from "@/lib/bridge";
import type { CronJob } from "@/lib/types";

interface Params {
  params: { id: string };
}

type BridgeCronResponse = {
  jobs?: any[];
} | any[];

function normalizeSchedule(job: any): string | undefined {
  const s = job?.schedule;
  if (!s) return undefined;
  if (typeof s === "string") return s;
  if (typeof s === "object") {
    if (s.kind === "cron" && s.expr) return `${s.expr}${s.tz ? ` (${s.tz})` : ""}`;
    if (s.kind === "every" && s.everyMs) return `every ${s.everyMs}ms`;
    if (s.kind === "at" && s.at) return `at ${s.at}`;
  }
  return undefined;
}

function normalizeLastRun(run: any): CronJob["lastRun"] {
  if (!run) return null;
  // Support both our bridge ({ts,status,error,runAtMs}) and other shapes.
  const status = String(run.status ?? run.lastStatus ?? "unknown");
  const ranAt =
    run.ranAt ??
    run.ts ??
    (typeof run.runAtMs === "number" ? new Date(run.runAtMs).toISOString() : undefined) ??
    "n/a";
  const durationMs = typeof run.durationMs === "number" ? run.durationMs : undefined;
  const error = run.error ? String(run.error) : undefined;
  return { status, ranAt, durationMs, error };
}

export async function GET(_: Request, { params }: Params) {
  try {
    const data = await bridgeFetchJson<BridgeCronResponse>(`/v1/gateways/${params.id}/cron`);
    const jobsRaw = Array.isArray(data) ? data : data?.jobs ?? [];

    const jobs: CronJob[] = jobsRaw.map((job: any) => ({
      id: String(job?.id ?? job?.jobId ?? job?.name ?? ""),
      name: String(job?.name ?? job?.id ?? "(unnamed)"),
      schedule: normalizeSchedule(job),
      lastRun: normalizeLastRun(job?.lastRun)
    }));

    return NextResponse.json(jobs);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
