"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import { apiGet, apiPost } from "@/lib/client";
import type { CronJob, Gateway } from "@/lib/types";

interface CronState {
  loading: boolean;
  error: string | null;
  jobs: CronJob[];
}

export default function CronPage() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [cron, setCron] = useState<Record<string, CronState>>({});
  const [busyJob, setBusyJob] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiGet<Gateway[]>("/api/gateways")
      .then((data) => {
        if (!active) return;
        setGateways(data);
        data.forEach((gateway) => {
          setCron((prev) => ({
            ...prev,
            [gateway.id]: { loading: true, error: null, jobs: [] }
          }));
          apiGet<CronJob[]>(`/api/gateways/${gateway.id}/cron`)
            .then((jobs) => {
              if (!active) return;
              setCron((prev) => ({
                ...prev,
                [gateway.id]: { loading: false, error: null, jobs }
              }));
            })
            .catch((err) => {
              if (!active) return;
              setCron((prev) => ({
                ...prev,
                [gateway.id]: {
                  loading: false,
                  error: err.message,
                  jobs: []
                }
              }));
            });
        });
      })
      .catch((err) => {
        if (active) {
          setGateways([]);
          setCron({});
          console.error(err);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const triggerRun = async (gatewayId: string, jobId: string) => {
    setBusyJob(`${gatewayId}:${jobId}`);
    try {
      await apiPost(`/api/gateways/${gatewayId}/cron/${jobId}/run`);
      const jobs = await apiGet<CronJob[]>(`/api/gateways/${gatewayId}/cron`);
      setCron((prev) => ({
        ...prev,
        [gatewayId]: { loading: false, error: null, jobs }
      }));
    } catch (error) {
      console.error(error);
      setCron((prev) => ({
        ...prev,
        [gatewayId]: {
          ...prev[gatewayId],
          error: error instanceof Error ? error.message : "Trigger failed"
        }
      }));
    } finally {
      setBusyJob(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-mc-muted">Cron</p>
        <h1 className="text-3xl font-semibold">Scheduled Jobs</h1>
      </div>

      <div className="space-y-6">
        {gateways.map((gateway) => {
          const state = cron[gateway.id];
          return (
            <Card
              key={gateway.id}
              title={gateway.name}
              action={<StatusBadge ok={gateway.ok} />}
            >
              {state?.loading && (
                <p className="text-sm text-mc-muted">Loading cron jobs...</p>
              )}
              {state?.error && (
                <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {state.error}
                </p>
              )}
              <div className="space-y-4">
                {state?.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-xl border border-white/10 bg-mc-panel/70 p-4 text-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{job.name}</p>
                        <p className="text-xs text-mc-muted">{job.schedule ?? "manual"}</p>
                      </div>
                      <button
                        onClick={() => triggerRun(gateway.id, job.id)}
                        disabled={busyJob === `${gateway.id}:${job.id}`}
                        className="rounded-full border border-white/10 px-4 py-1 text-xs transition hover:border-mc-accent hover:text-mc-accent disabled:opacity-50"
                      >
                        {busyJob === `${gateway.id}:${job.id}` ? "Running..." : "Run now"}
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-mc-muted">
                      <span>
                        Last: {job.lastRun?.ranAt ?? "n/a"}
                      </span>
                      <span>
                        Status: {job.lastRun?.status ?? "unknown"}
                      </span>
                      {job.lastRun?.error && (
                        <span className="text-rose-200">Error: {job.lastRun.error}</span>
                      )}
                    </div>
                  </div>
                ))}
                {state && state.jobs.length === 0 && !state.loading && (
                  <p className="text-sm text-mc-muted">No cron jobs reported.</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
