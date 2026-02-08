"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import { apiGet } from "@/lib/client";
import type { Gateway, SessionInfo } from "@/lib/types";

interface SessionState {
  loading: boolean;
  error: string | null;
  sessions: SessionInfo[];
}

export default function SessionsPage() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [sessions, setSessions] = useState<Record<string, SessionState>>({});

  useEffect(() => {
    let active = true;
    apiGet<Gateway[]>("/api/gateways")
      .then((data) => {
        if (!active) return;
        setGateways(data);
        data.forEach((gateway) => {
          setSessions((prev) => ({
            ...prev,
            [gateway.id]: { loading: true, error: null, sessions: [] }
          }));
          apiGet<SessionInfo[]>(`/api/gateways/${gateway.id}/sessions`)
            .then((items) => {
              if (!active) return;
              setSessions((prev) => ({
                ...prev,
                [gateway.id]: { loading: false, error: null, sessions: items }
              }));
            })
            .catch((err) => {
              if (!active) return;
              setSessions((prev) => ({
                ...prev,
                [gateway.id]: { loading: false, error: err.message, sessions: [] }
              }));
            });
        });
      })
      .catch((err) => console.error(err));

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-mc-muted">Sessions</p>
        <h1 className="text-3xl font-semibold">Active Sessions</h1>
      </div>

      {gateways.map((gateway) => {
        const state = sessions[gateway.id];
        return (
          <Card
            key={gateway.id}
            title={gateway.name}
            action={<StatusBadge ok={gateway.ok} />}
          >
            {state?.loading && (
              <p className="text-sm text-mc-muted">Loading sessions...</p>
            )}
            {state?.error && (
              <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {state.error}
              </p>
            )}
            <div className="space-y-3 text-sm">
              {state?.sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-mc-panel/70 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold">{session.user ?? "Session"}</p>
                    <p className="text-xs text-mc-muted">{session.id}</p>
                  </div>
                  <div className="text-xs text-mc-muted">
                    <p>Status: {session.status ?? "unknown"}</p>
                    <p>Started: {session.startedAt ?? "n/a"}</p>
                  </div>
                  <div className="text-xs text-mc-muted">
                    <p>Tokens: {session.tokensUsed ?? "n/a"}</p>
                    <p>Context: {session.contextBytes ?? "n/a"}</p>
                  </div>
                </div>
              ))}
              {state && state.sessions.length === 0 && !state.loading && (
                <p className="text-sm text-mc-muted">No active sessions reported.</p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
