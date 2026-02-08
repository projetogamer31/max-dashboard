export interface Gateway {
  id: string;
  name: string;
  url: string;
  reachableMs: number | null;
  version: string | null;
  ok: boolean;
}

export interface SessionInfo {
  id: string;
  user?: string;
  status?: string;
  tokensUsed?: number;
  startedAt?: string;
  contextBytes?: number;
}

export interface CronJob {
  id: string;
  name: string;
  schedule?: string;
  lastRun?: {
    status: string;
    ranAt: string;
    durationMs?: number;
    error?: string;
  } | null;
}

export interface GatewayLog {
  ts: string;
  level: string;
  message: string;
}
