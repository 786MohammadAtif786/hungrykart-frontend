import { useEffect, useState } from "react";

type Props = {
  otp?: string;
  expiresAt?: string;
  status: string;
  onRegenerate: () => Promise<void>;
};

const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();

export default function OrderOtp({ otp, expiresAt, status, onRegenerate }: Props) {
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Delivered / cancelled order, ya OTP kabhi bana hi nahi: kuch mat dikhao
  if (["DELIVERED", "CANCELLED"].includes(status)) return null;
  if (!otp && !expiresAt) return null;

  const exp = expiresAt ? new Date(expiresAt) : null;
  const left = exp ? exp.getTime() - now : 0;
  const expired = !otp || left <= 0;
  const minsLeft = Math.max(1, Math.ceil(left / 60000));

  const copy = async () => {
    if (!otp) return;
    try {
      await navigator.clipboard.writeText(otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard allowed nahi */
    }
  };

  const regen = async () => {
    setBusy(true);
    setErr("");
    try {
      await onRegenerate();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "OTP nahi ban paya");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
      <div className="flex min-w-[220px] flex-1 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
          🔒
        </div>
        <div>
          <p className="text-sm font-bold">Delivery OTP</p>
          <p className="text-xs text-ink/60">Order aane par ye OTP delivery partner ko batao.</p>
        </div>
      </div>

      {expired ? (
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-red-600">OTP expire ho gaya</span>
            <button
              onClick={regen}
              disabled={busy}
              className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {busy ? "Ban raha hai..." : "Naya OTP lo"}
            </button>
          </div>
          {err && <span className="text-xs text-red-600">{err}</span>}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-dashed border-red-300 bg-white px-4 py-2 text-xl font-extrabold tracking-[0.35em] text-red-600">
              {otp}
            </div>
            <button
              onClick={copy}
              title="Copy"
              className="h-10 w-10 rounded-lg border border-ink/10 bg-white text-sm"
            >
              {copied ? "✓" : "⧉"}
            </button>
          </div>
          <div className="border-l border-ink/10 pl-4 text-xs text-ink/60">
            <p className="font-semibold text-red-600">Valid for {minsLeft} minutes</p>
            {exp && <p>Expires at {fmtTime(exp)}</p>}
          </div>
        </>
      )}
    </div>
  );
}