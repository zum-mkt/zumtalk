// Chamadas à API do Worker (worker/index.ts).

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, { credentials: "same-origin", ...init });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new ApiError(data.error ?? `Erro ${res.status}`, res.status);
  return data;
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

const jsonInit = (method: string, body?: unknown): RequestInit => ({
  method,
  headers: { "content-type": "application/json" },
  body: body === undefined ? undefined : JSON.stringify(body),
});

export const api = {
  session: () => call<{ authed: boolean; configured: boolean }>("/api/session"),
  login: (password: string) => call<{ ok: true }>("/api/login", jsonInit("POST", { password })),
  logout: () => call<{ ok: true }>("/api/logout", jsonInit("POST")),
  getContent: () => call<{ content: unknown }>("/api/content"),
  saveContent: (content: unknown) => call<{ ok: true; savedAt: string }>("/api/content", jsonInit("PUT", content)),
  resetContent: () => call<{ ok: true }>("/api/content", { method: "DELETE" }),
  restorePrevious: () => call<{ ok: true; content: unknown }>("/api/content/previous", jsonInit("POST")),
};
