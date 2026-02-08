"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import { apiGet } from "@/lib/client";
import type { Gateway } from "@/lib/types";

export default function OverviewPage() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiGet<Gateway[]>("/api/gateways")
      .then((data) => {
        if (active) {
          setGateways(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-mc-muted">Overview</p>
          <h1 className="text-3xl font-semibold">Gateway Fleet</h1>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:border-mc-accent hover:text-mc-accent"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-sm text-mc-muted">Loading gateways...</p>}
      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {gateways.map((gateway) => (
          <Card
            key={gateway.id}
            title={gateway.name}
            action={<StatusBadge ok={gateway.ok} />}
          >
            <div className="space-y-3 text-sm text-mc-muted">
              <div className="flex items-center justify-between">
                <span>Gateway ID</span>
                <span className="text-white">{gateway.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>URL</span>
                <span className="text-white">{gateway.url}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Latency</span>
                <span className="text-white">
                  {gateway.reachableMs !== null ? `${gateway.reachableMs} ms` : "n/a"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Version</span>
                <span className="text-white">{gateway.version ?? "unknown"}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
