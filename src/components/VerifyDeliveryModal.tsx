import { useEffect, useRef, useState } from "react";
import type { DeliveryOrder } from "../Deliveryapi";

const LEN = 6;

type Props = {
  order: DeliveryOrder;
  /** Server se OTP verify karwao. Galat OTP par error throw hona chahiye. */
  onVerify: (otp: string) => Promise<void>;
  onClose: () => void;
};

export default function VerifyDeliveryModal({ order, onVerify, onClose }: Props) {
  const [digits, setDigits] = useState<string[]>(Array(LEN).fill(""));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const otp = digits.join("");
  const ready = otp.length === LEN;
  const d = order.deliveryDetails;

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  const setAt = (i: number, v: string) =>
    setDigits((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });

  const onChange = (i: number, raw: string) => {
    const v = raw.replace(/\D/g, "").slice(-1);
    setErr("");
    setAt(i, v);
    if (v && i < LEN - 1) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < LEN - 1) {
      refs.current[i + 1]?.focus();
    } else if (e.key === "Enter" && ready) {
      submit();
    }
  };

  // Poora OTP paste karne par saare boxes bhar do
  const onPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LEN);
    if (!text) return;
    e.preventDefault();
    const next = Array(LEN).fill("");
    text.split("").forEach((c, idx) => (next[idx] = c));
    setDigits(next);
    setErr("");
    refs.current[Math.min(text.length, LEN - 1)]?.focus();
  };

  const submit = async () => {
    if (!ready || busy) return;
    setBusy(true);
    setErr("");
    try {
      await onVerify(otp);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "OTP verify nahi hua");
      setDigits(Array(LEN).fill(""));
      refs.current[0]?.focus();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="vd-overlay" role="dialog" aria-modal="true" aria-label="Verify delivery">
      <div className="vd-sheet">
        <header className="vd-head">
          <button className="vd-back" onClick={onClose} disabled={busy} aria-label="Back">
            ←
          </button>
          <h2>Verify Delivery</h2>
        </header>

        <div className="vd-body">
          <div className="vd-hero">🛵</div>

          <div className="vd-info">
            <b>#{order.orderNumber}</b>
            <span>{d.fullName}</span>
            <span className="vd-muted">
              {d.address}
              {d.landmark ? `, ${d.landmark}` : ""}
            </span>
            <span className="vd-muted">📞 {d.phone}</span>
          </div>

          <h3 className="vd-title">Enter Customer OTP</h3>
          <p className="vd-sub">Ask the customer to share the 6-digit OTP.</p>

          <div className="vd-boxes" onPaste={onPaste}>
            {digits.map((v, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className={`vd-box ${err ? "bad" : ""}`}
                value={v}
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={1}
                disabled={busy}
                onChange={(e) => onChange(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                onFocus={(e) => e.target.select()}
                aria-label={`OTP digit ${i + 1}`}
              />
            ))}
          </div>

          {err && <p className="vd-err">{err}</p>}

          <button className="vd-btn" disabled={!ready || busy} onClick={submit}>
            {busy ? "Verifying…" : "Verify OTP"}
          </button>

          <div className="vd-note">
            <span>i</span>
            <p>Only after successful verification, the order is marked as Delivered.</p>
          </div>
        </div>
      </div>
    </div>
  );
}