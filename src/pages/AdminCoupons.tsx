import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { couponApi, type Coupon, type CouponStatus } from "../api/Couponapi";
import { fmtDateTime, rupees } from "../Ordertypes";
import CouponForm from "../components/CouponForm";
import Modal from "../components/Modal";
import "../css/Admincoupons.css";

const TABS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "scheduled", label: "Scheduled" },
  { key: "expired", label: "Expired" },
  { key: "inactive", label: "Inactive" },
  { key: "archived", label: "Archived" },
];

const STATUS_LABEL: Record<CouponStatus, string> = {
  active: "Active",
  scheduled: "Scheduled",
  expired: "Expired",
  exhausted: "Fully used",
  inactive: "Inactive",
  archived: "Archived",
};

const discountText = (c: Coupon) =>
  c.discountType === "fixed"
    ? `${rupees(c.discountValue)} off`
    : `${c.discountValue}% off${c.maxDiscount != null ? ` (up to ${rupees(c.maxDiscount)})` : ""}`;

const validityText = (c: Coupon) => {
  if (c.startsAt && c.expiresAt) return `${fmtDateTime(c.startsAt)} → ${fmtDateTime(c.expiresAt)}`;
  if (c.expiresAt) return `Until ${fmtDateTime(c.expiresAt)}`;
  if (c.startsAt) return `From ${fmtDateTime(c.startsAt)}`;
  return "No expiry";
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function AdminCoupons() {
  const { token } = useAuth();

  // ---- list + filters ----
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---- UI state ----
  const [formFor, setFormFor] = useState<{ coupon: Coupon | null } | null>(null);
  const [detail, setDetail] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState<Coupon | null>(null);
  const [busyId, setBusyId] = useState("");
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);
  const reqId = useRef(0);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 3500);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // search debounce
  useEffect(() => {
    const t = window.setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 400);
    return () => window.clearTimeout(t);
  }, [search]);

  const load = useCallback(
    async (silent = false) => {
      if (!token) return;
      const id = ++reqId.current;
      if (!silent) setLoading(true);
      try {
        const r = await couponApi.list(token, { status: tab, q, page });
        if (id !== reqId.current) return;
        setCoupons(r.coupons);
        setTotal(r.total);
        setPages(r.pages);
        setError("");
      } catch (e) {
        if (id === reqId.current) setError(e instanceof Error ? e.message : "Could not load coupons");
      } finally {
        if (id === reqId.current && !silent) setLoading(false);
      }
    },
    [token, tab, q, page]
  );

  useEffect(() => {
    load();
  }, [load]);

  // ---- actions ----
  const replaceInList = (c: Coupon) => {
    setCoupons((prev) => prev.map((x) => (x._id === c._id ? c : x)));
    setDetail((d:any) => (d && d._id === c._id ? c : d));
  };

  const toggleActive = async (c: Coupon) => {
    if (!token || busyId) return;
    setBusyId(c._id);
    try {
      const { coupon } = await couponApi.setStatus(token, c._id, !c.active);
      replaceInList(coupon);
      notify(`${coupon.code} is now ${coupon.active ? "active" : "inactive"}`);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Could not update status");
    } finally {
      setBusyId("");
    }
  };

  const confirmDelete = async () => {
    if (!token || !deleting || busyId) return;
    const c = deleting;
    setBusyId(c._id);
    try {
      const r = await couponApi.remove(token, c._id);
      setDeleting(null);
      setDetail(null);
      notify(r.archived ? `${c.code} was archived` : `${c.code} deleted`);
      if (coupons.length === 1 && page > 1) setPage(page - 1);
      else load(true);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Could not delete coupon");
    } finally {
      setBusyId("");
    }
  };

  const onSaved = (c: Coupon, created: boolean) => {
    setFormFor(null);
    notify(created ? `${c.code} created` : `${c.code} updated`);
    setDetail((d:any) => (d && d._id === c._id ? c : d));
    if (created && tab !== "all") setTab("all");
    load(true);
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      notify(`Copied ${code}`);
    } catch {
      notify("Could not copy");
    }
  };

  // ---- summary (current list par based) ----
  const now = Date.now();
  const activeCount = coupons.filter((c) => c.status === "active").length;
  const totalUses = coupons.reduce((s, c) => s + c.usedCount, 0);
  const expiringSoon = coupons.filter(
    (c) => c.status === "active" && c.expiresAt && new Date(c.expiresAt).getTime() - now < 7 * 86_400_000
  ).length;

  const noResults = !loading && !error && coupons.length === 0;

  return (
    <div className="ac-page ac-root">
      <header className="ac-header">
        <div>
          <h1>Coupons</h1>
          <p>Create discount codes, track how much they are used, and manage them.</p>
        </div>
        <button className="ac-btn primary" onClick={() => setFormFor({ coupon: null })}>
          + Create coupon
        </button>
      </header>

      <section className="ac-stats">
        <div className="ac-stat">
          <span>Total coupons</span>
          <b>{pad(total)}</b>
          <small>{tab === "all" ? "All (not archived)" : TABS.find((t) => t.key === tab)?.label}</small>
        </div>
        <div className="ac-stat green">
          <span>Active</span>
          <b>{pad(activeCount)}</b>
          <small>On this page</small>
        </div>
        <div className="ac-stat blue">
          <span>Total uses</span>
          <b>{totalUses}</b>
          <small>On this page</small>
        </div>
        <div className="ac-stat orange">
          <span>Expiring in 7 days</span>
          <b>{pad(expiringSoon)}</b>
          <small>On this page</small>
        </div>
      </section>

      <div className="ac-toolbar">
        <input
          className="ac-search"
          type="search"
          placeholder="Search by coupon code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search coupons"
        />
      </div>

      <nav className="ac-tabs" aria-label="Filter by status">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={tab === t.key ? "on" : ""}
            onClick={() => {
              setTab(t.key);
              setPage(1);
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {error && (
        <div className="ac-error">
          {error}{" "}
          <button className="ac-link" onClick={() => load()}>
            Retry
          </button>
        </div>
      )}
      {loading && <p className="ac-muted">Loading coupons…</p>}
      {noResults && (
        <div className="ac-empty">
          <b>No coupons found</b>
          <span>{q || tab !== "all" ? "Try changing your filters" : "Create your first coupon to get started"}</span>
          {!q && tab === "all" && (
            <button className="ac-btn primary" onClick={() => setFormFor({ coupon: null })}>
              + Create coupon
            </button>
          )}
        </div>
      )}

      {coupons.length > 0 && (
        <div className="ac-table">
          <div className="ac-thead">
            <span>Coupon</span>
            <span>Discount</span>
            <span>Usage</span>
            <span>Validity</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {coupons.map((c) => {
            const pct = c.usageLimit ? Math.min(100, Math.round((c.usedCount / c.usageLimit) * 100)) : 0;
            const archived = c.status === "archived";
            return (
              <div key={c._id} className={`ac-row st-${c.status}`}>
                <div className="ac-cell" data-label="Coupon">
                  <div className="ac-code-line">
                    <button className="ac-code" onClick={() => setDetail(c)} title="View details">
                      {c.code}
                    </button>
                    <button className="ac-copy" onClick={() => copyCode(c.code)} aria-label={`Copy ${c.code}`}>
                      Copy
                    </button>
                  </div>
                  {c.description && <div className="ac-muted">{c.description}</div>}
                </div>

                <div className="ac-cell" data-label="Discount">
                  <div className="ac-strong">{discountText(c)}</div>
                  <div className="ac-muted">
                    {c.minimumOrderAmount > 0 ? `Min order ${rupees(c.minimumOrderAmount)}` : "No minimum order"}
                  </div>
                </div>

                <div className="ac-cell" data-label="Usage">
                  <div>
                    <b>{c.usedCount}</b> / {c.usageLimit ?? "∞"} used
                  </div>
                  {c.usageLimit != null && (
                    <div className="ac-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                      <i style={{ width: `${pct}%` }} />
                    </div>
                  )}
                  <div className="ac-muted">Per user: {c.perUserLimit ?? "unlimited"}</div>
                </div>

                <div className="ac-cell" data-label="Validity">
                  <div className="ac-muted-strong">{validityText(c)}</div>
                </div>

                <div className="ac-cell" data-label="Status">
                  <span className={`ac-st st-${c.status}`}>{STATUS_LABEL[c.status]}</span>
                </div>

                <div className="ac-cell ac-actions">
                  <button className="ac-btn ghost sm" onClick={() => setDetail(c)}>
                    View
                  </button>
                  {!archived && (
                    <>
                      <button className="ac-btn ghost sm" onClick={() => setFormFor({ coupon: c })}>
                        Edit
                      </button>
                      <button className="ac-btn ghost sm" disabled={busyId === c._id} onClick={() => toggleActive(c)}>
                        {c.active ? "Deactivate" : "Activate"}
                      </button>
                    </>
                  )}
                  {!archived && (
                    <button className="ac-btn danger sm" onClick={() => setDeleting(c)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pages > 1 && (
        <div className="ac-pager">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </button>
          <span>
            Page {page} of {pages} · {total} coupons
          </span>
          <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next →
          </button>
        </div>
      )}

      {toast && (
        <div className="ac-toast ac-root" role="status">
          {toast}
        </div>
      )}

      {/* ---- Create / Edit ---- */}
      {formFor && <CouponForm coupon={formFor.coupon} onClose={() => setFormFor(null)} onSaved={onSaved} />}

      {/* ---- Details ---- */}
      {detail && token && (
        <CouponDetail
          coupon={detail}
          token={token}
          busy={busyId === detail._id}
          onClose={() => setDetail(null)}
          onEdit={() => {
            setFormFor({ coupon: detail });
            setDetail(null);
          }}
          onToggle={() => toggleActive(detail)}
          onDelete={() => {
            setDeleting(detail);
            setDetail(null);
          }}
        />
      )}

      {/* ---- Delete confirm ---- */}
      {deleting && (
        <Modal
          title={`Delete ${deleting.code}?`}
          onClose={() => setDeleting(null)}
          locked={busyId === deleting._id}
          size="sm"
          footer={
            <>
              <button className="ac-btn ghost" onClick={() => setDeleting(null)} disabled={busyId === deleting._id}>
                Keep coupon
              </button>
              <button className="ac-btn danger solid" onClick={confirmDelete} disabled={busyId === deleting._id}>
                {busyId === deleting._id ? "Working…" : deleting.usedCount > 0 ? "Archive coupon" : "Delete coupon"}
              </button>
            </>
          }
        >
          {deleting.usedCount > 0 ? (
            <p className="ac-note">
              This coupon has been used <b>{deleting.usedCount}</b> time{deleting.usedCount === 1 ? "" : "s"}. To keep the
              record of past orders, it will be <b>archived</b> instead of deleted. Customers will no longer be able to
              use it.
            </p>
          ) : (
            <p className="ac-note">
              This coupon has never been used. It will be <b>permanently deleted</b> and this cannot be undone.
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------ Details modal ------------------------------ */

interface DetailProps {
  coupon: Coupon;
  token: string;
  busy: boolean;
  onClose: () => void;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

function CouponDetail({ coupon: c, token, busy, onClose, onEdit, onToggle, onDelete }: DetailProps) {
  const [uniqueUsers, setUniqueUsers] = useState<number | null>(null);
  const [statErr, setStatErr] = useState("");

  // fresh usage stats (kitne alag users ne use kiya)
  useEffect(() => {
    let alive = true;
    couponApi
      .get(token, c._id)
      .then((r:any) => alive && setUniqueUsers(r.stats.uniqueUsers))
      .catch((e:any) => alive && setStatErr(e instanceof Error ? e.message : "Could not load usage"));
    return () => {
      alive = false;
    };
  }, [token, c._id, c.usedCount]);

  const archived = c.status === "archived";
  const remaining = c.usageLimit == null ? "Unlimited" : String(Math.max(0, c.usageLimit - c.usedCount));
  const pct = c.usageLimit ? Math.min(100, Math.round((c.usedCount / c.usageLimit) * 100)) : 0;

  const rows: [string, string][] = [
    ["Discount", discountText(c)],
    ["Type", c.discountType === "percentage" ? "Percentage" : "Fixed amount"],
    ["Minimum order", c.minimumOrderAmount > 0 ? rupees(c.minimumOrderAmount) : "None"],
    ["Max discount", c.discountType === "percentage" ? (c.maxDiscount != null ? rupees(c.maxDiscount) : "No cap") : "-"],
    ["Total usage limit", c.usageLimit == null ? "Unlimited" : String(c.usageLimit)],
    ["Per user limit", c.perUserLimit == null ? "Unlimited" : String(c.perUserLimit)],
    ["Starts", c.startsAt ? fmtDateTime(c.startsAt) : "Immediately"],
    ["Expires", c.expiresAt ? fmtDateTime(c.expiresAt) : "Never"],
    ["Created", fmtDateTime(c.createdAt)],
    ["Last updated", fmtDateTime(c.updatedAt)],
  ];

  return (
    <Modal
      title={c.code}
      subtitle={c.description || undefined}
      onClose={onClose}
      size="md"
      footer={
        <>
          {!archived && (
            <button className="ac-btn danger" onClick={onDelete} disabled={busy}>
              Delete
            </button>
          )}
          {!archived && (
            <button className="ac-btn ghost" onClick={onToggle} disabled={busy}>
              {c.active ? "Deactivate" : "Activate"}
            </button>
          )}
          {!archived && (
            <button className="ac-btn primary" onClick={onEdit} disabled={busy}>
              Edit
            </button>
          )}
        </>
      }
    >
      <div className="ac-detail-top">
        <span className={`ac-st st-${c.status}`}>{STATUS_LABEL[c.status]}</span>
        {archived && c.archivedAt && <span className="ac-muted">Archived on {fmtDateTime(c.archivedAt)}</span>}
      </div>

      {/* Usage */}
      <div className="ac-usage-box">
        <div className="ac-usage-nums">
          <div>
            <b>{c.usedCount}</b>
            <span>Times used</span>
          </div>
          <div>
            <b>{uniqueUsers ?? "…"}</b>
            <span>Unique customers</span>
          </div>
          <div>
            <b>{remaining}</b>
            <span>Remaining</span>
          </div>
        </div>
        {c.usageLimit != null && (
          <div className="ac-bar lg" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <i style={{ width: `${pct}%` }} />
          </div>
        )}
        {statErr && <p className="ac-muted">{statErr}</p>}
      </div>

      <dl className="ac-kv">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  );
}