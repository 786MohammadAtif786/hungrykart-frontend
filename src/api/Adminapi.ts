// // Admin pages ke liye ek hi jagah API helper (token + JSON handling)

// const API = (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL ?? "";

// // Token jis key me bhi ho, yahan dhoondh leta hai. Apni asli key pata ho to sirf wahi rakh do.
// function findToken(): string | null {
//   for (const k of ["token", "accessToken", "authToken", "hk_token", "jwt"]) {
//     const v = localStorage.getItem(k);
//     if (v) return v.replace(/^"|"$/g, "");
//   }
//   for (const k of ["user", "auth", "authUser", "userInfo"]) {
//     try {
//       const o = JSON.parse(localStorage.getItem(k) ?? "null");
//       if (o?.token) return String(o.token);
//     } catch {
//       /* ignore */
//     }
//   }
//   return null;
// }

// export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
//   const token = findToken();
//   const res = await fetch(`${API}${path}`, {
//     ...init,
//     credentials: "include",
//     headers: {
//       ...(init.body ? { "Content-Type": "application/json" } : {}),
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(init.headers ?? {}),
//     },
//   });

//   const data = await res.json().catch(() => null);
//   if (!res.ok) throw new Error((data as { message?: string } | null)?.message ?? `Request failed (${res.status})`);
//   return data as T;
// }



// Admin pages ke liye ek hi jagah API helper (token + JSON handling)

const API = (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL ?? "";

// AdminLayout login wala token (useAuth().token) yahan set karta hai
let currentToken: string | null = null;
export function setAuthToken(t: string | null | undefined) {
  currentToken = t ?? null;
}

// Fallback: token localStorage me kisi common key me ho to wahan se
function findToken(): string | null {
  for (const k of ["token", "accessToken", "authToken", "hk_token", "jwt"]) {
    const v = localStorage.getItem(k);
    if (v) return v.replace(/^"|"$/g, "");
  }
  for (const k of ["user", "auth", "authUser", "userInfo"]) {
    try {
      const o = JSON.parse(localStorage.getItem(k) ?? "null");
      if (o?.token) return String(o.token);
    } catch {
      /* ignore */
    }
  }
  return null;
}

export async function api<T>(path: string, init: RequestInit = {}, token?: string | null): Promise<T> {
  const t = token ?? currentToken ?? findToken();
  const res = await fetch(`${API}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data as { message?: string } | null)?.message ?? `Request failed (${res.status})`);
  return data as T;
}