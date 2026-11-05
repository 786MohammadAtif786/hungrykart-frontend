import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** true ho to Esc / bahar click / X se band nahi hota (jaise save chal raha ho) */
  locked?: boolean;
}

export default function Modal({ title, subtitle, onClose, children, footer, size = "md", locked = false }: Props) {
  // peeche ka page scroll band
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Esc se band
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !locked) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, locked]);

  // Portal: navbar / parent ke stacking context se bahar render hota hai
  return createPortal(
    <div
      className="ac-overlay ac-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ac-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !locked) onClose();
      }}
    >
      <div className={`ac-modal ${size}`}>
        <div className="ac-modal-head">
          <div>
            <h2 id="ac-modal-title">{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="ac-x" onClick={onClose} disabled={locked} aria-label="Close">
            ×
          </button>
        </div>
        <div className="ac-modal-body">{children}</div>
        {footer && <div className="ac-modal-foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}