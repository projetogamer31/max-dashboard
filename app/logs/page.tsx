"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import { apiGet } from "@/lib/client";
import type { Gateway, GatewayLog } from "@/lib/types";

export default function LogsPage() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [activeGateway, setActiveGateway] = useState<string>("");
  const [logs, setLogs] = useState<GatewayLog[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiGet<Gateway[]>("/api/gateways")
      .then((data) => {
        if (!active) return;
        setGateways(data);
        if (data.length > 0) {
          setActiveGateway(data[0].id);
        }
      })
      .catch((err) => console.error(err));
    return () => {
      active = false;
    };
  }, []);

  const loadLogs = async (gatewayId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<GatewayLog[]>(
        `/api/gateways/${gatewayId}/logs?limit=200`
      );
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeGateway) {
      loadLogs(activeGateway);
    }
  }, [activeGateway]);

  const filtered = useMemo(() => {
    if (!filter) return logs;
    const needle = filter.toLowerCase();
    return logs.filter(
      (log) =>
        log.message.toLowerCase().includes(needle) ||
        log.level.toLowerCase().includes(needle)
    );
  }, [filter, logs]);

  const currentGateway = gateways.find((g) => g.id === activeGateway);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-mc-muted">Logs</p>
        <h1 className="text-3xl font-semibold">Gateway Logs</h1>
      </div>

      <Card
        title="Log Tail"
        action={
          currentGateway ? <StatusBadge ok={currentGateway.ok} /> : undefined
        }
      >
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <select
            value={activeGateway}
            onChange={(event) => setActiveGateway(event.target.value)}
            className="rounded-lg border border-white/10 bg-mc-panel px-3 py-2 text-white"
          >
            {gateways.map((gateway) => (
              <option key={gateway.id} value={gateway.id}>
                {gateway.name}
              </option>
            ))}
          </select>
          <input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filter logs"
            className="flex-1 rounded-lg border border-white/10 bg-mc-panel px-3 py-2 text-white"
          />
          <button
            onClick={() => activeGateway && loadLogs(activeGateway)}
            className="rounded-full border border-white/10 px-4 py-2 text-xs transition hover:border-mc-accent hover:text-mc-accent"
          >
            Refresh
          </button>
        </div>

        {loading && <p className="mt-4 text-sm text-mc-muted">Loading logs...</p>}
        {error && (
          <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        )}

        <div className="mt-4 max-h-[480px] overflow-auto rounded-xl border border-white/10 bg-mc-panel p-4 text-xs text-mc-muted">
          {filtered.length === 0 && !loading ? (
            <p>No logs match the filter.</p>
          ) : (
            <ul className="space-y-2">
              {filtered.map((log, index) => (
                <li key={`${log.ts}-${index}`} className="flex gap-3">
                  <span className="min-w-[140px] text-white/80">{log.ts}</span>
                  <span className="min-w-[60px] uppercase text-mc-accent">
                    {log.level}
                  </span>
                  <span className="text-white">{log.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
