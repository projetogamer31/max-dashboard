import { NextResponse } from "next/server";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export function getBridgeConfig() {
  return {
    baseUrl: getEnv("BRIDGE_BASE_URL").replace(/\/$/, ""),
    apiKey: getEnv("BRIDGE_API_KEY")
  };
}

export async function bridgeFetch(path: string, init?: RequestInit) {
  const { baseUrl, apiKey } = getBridgeConfig();
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: text || "Bridge request failed", status: res.status },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
