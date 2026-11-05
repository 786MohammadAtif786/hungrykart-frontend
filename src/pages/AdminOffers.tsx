// import { useCallback, useEffect, useState } from "react";
// import { adminOffersApi } from "../api/Offer";
// import OfferFormModal from "../components/OfferFormModal";
// import type { ListMeta, Offer, OfferPayload } from "../types/Offer";

// const LIMIT = 10;

// const fmtDate = (iso: string) =>
//   new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

// const discountLabel = (o: Offer) =>
//   o.discountType === "percentage"
//     ? `${o.discountValue}% OFF${o.maxDiscount ? ` (max ₹${o.maxDiscount})` : ""}`
//     : `₹${o.discountValue} OFF`;

// type Phase = "upcoming" | "live" | "expired" | "inactive";
// const getPhase = (o: Offer): Phase => {
//   if (!o.isActive) return "inactive";
//   const now = Date.now();
//   if (now < new Date(o.startDate).getTime()) return "upcoming";
//   if (now > new Date(o.endDate).getTime()) return "expired";
//   return "live";
// };

// const PHASE_STYLE: Record<Phase, string> = {
//   live: "bg-green-100 text-green-700",
//   upcoming: "bg-blue-100 text-blue-700",
//   expired: "bg-gray-200 text-gray-600",
//   inactive: "bg-red-100 text-red-600",
// };

// function Toggle({ on, onClick, disabled }: { on: boolean; onClick: () => void; disabled?: boolean }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       aria-pressed={on}
//       className={`relative w-11 h-6 rounded-full transition-colors disabled:opacity-50 ${on ? "bg-sauce" : "bg-ink/20"}`}
//     >
//       <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : ""}`} />
//     </button>
//   );
// }

// export default function AdminOffers() {
//   const [offers, setOffers] = useState<Offer[]>([]);
//   const [meta, setMeta] = useState<ListMeta>({ page: 1, limit: LIMIT, total: 0 });
//   const [page, setPage] = useState(1);
//   const [filter, setFilter] = useState<"" | "true" | "false">("");
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editing, setEditing] = useState<Offer | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [formErr, setFormErr] = useState("");
//   const [busyId, setBusyId] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setErr("");
//     try {
//       const res = await adminOffersApi.list({ page, limit: LIMIT, isActive: filter });
//       setOffers(res.data);
//       setMeta(res.meta);
//     } catch (e) {
//       setErr((e as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, filter]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const openNew = () => {
//     setEditing(null);
//     setFormErr("");
//     setModalOpen(true);
//   };

//   const openEdit = (o: Offer) => {
//     setEditing(o);
//     setFormErr("");
//     setModalOpen(true);
//   };

//   const handleSubmit = async (payload: OfferPayload) => {
//     setSaving(true);
//     setFormErr("");
//     try {
//       if (editing) await adminOffersApi.update(editing._id, payload);
//       else await adminOffersApi.create(payload);
//       setModalOpen(false);
//       await load();
//     } catch (e) {
//       setFormErr((e as Error).message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleToggle = async (o: Offer) => {
//     setBusyId(o._id);
//     try {
//       const res = await adminOffersApi.setStatus(o._id, !o.isActive);
//       setOffers((prev) => prev.map((x) => (x._id === o._id ? res.data : x)));
//     } catch (e) {
//       alert((e as Error).message);
//     } finally {
//       setBusyId(null);
//     }
//   };

//   const handleDelete = async (o: Offer) => {
//     if (!window.confirm(`"${o.title}" offer delete karna hai?`)) return;
//     setBusyId(o._id);
//     try {
//       await adminOffersApi.remove(o._id);
//       // last item delete hua to pichle page par jao
//       if (offers.length === 1 && page > 1) setPage(page - 1);
//       else await load();
//     } catch (e) {
//       alert((e as Error).message);
//     } finally {
//       setBusyId(null);
//     }
//   };

//   const totalPages = Math.max(Math.ceil(meta.total / meta.limit), 1);

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
//         <div>
//           <h1 className="text-2xl font-extrabold">Offers</h1>
//           <p className="text-sm text-ink/60">{meta.total} total offers</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <select
//             value={filter}
//             onChange={(e) => {
//               setPage(1);
//               setFilter(e.target.value as "" | "true" | "false");
//             }}
//             className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm font-semibold"
//           >
//             <option value="">All</option>
//             <option value="true">Active</option>
//             <option value="false">Inactive</option>
//           </select>
//           <button onClick={openNew} className="bg-sauce text-white font-bold text-sm px-4 py-2 rounded-lg shadow whitespace-nowrap">
//             + New Offer
//           </button>
//         </div>
//       </div>

//       {err && (
//         <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between">
//           <span>{err}</span>
//           <button onClick={load} className="font-bold underline">Retry</button>
//         </div>
//       )}

//       {loading ? (
//         <div className="py-20 text-center text-ink/50">Loading offers...</div>
//       ) : offers.length === 0 ? (
//         <div className="py-20 text-center bg-white rounded-xl border border-ink/10">
//           <div className="text-4xl mb-2">🏷️</div>
//           <p className="font-bold">Koi offer nahi mila</p>
//           <p className="text-sm text-ink/60 mb-4">Pehla offer bana ke customers ko discount do.</p>
//           <button onClick={openNew} className="bg-sauce text-white font-bold text-sm px-4 py-2 rounded-lg">
//             + New Offer
//           </button>
//         </div>
//       ) : (
//         <>
//           {/* Desktop table */}
//           <div className="hidden md:block bg-white rounded-xl border border-ink/10 overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-ink/5 text-left text-xs uppercase text-ink/60">
//                 <tr>
//                   <th className="px-4 py-3">Offer</th>
//                   <th className="px-4 py-3">Discount</th>
//                   <th className="px-4 py-3">Validity</th>
//                   <th className="px-4 py-3">Usage</th>
//                   <th className="px-4 py-3">Status</th>
//                   <th className="px-4 py-3">Active</th>
//                   <th className="px-4 py-3 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {offers.map((o) => {
//                   const phase = getPhase(o);
//                   return (
//                     <tr key={o._id} className="border-t border-ink/10 align-top">
//                       <td className="px-4 py-3">
//                         <div className="font-bold">{o.title}</div>
//                         {o.code && (
//                           <span className="inline-block mt-1 border border-dashed border-sauce text-sauce text-xs font-bold px-2 py-0.5 rounded">
//                             {o.code}
//                           </span>
//                         )}
//                         {o.description && <div className="text-xs text-ink/60 mt-1 max-w-xs">{o.description}</div>}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <div className="font-semibold">{discountLabel(o)}</div>
//                         {o.minOrderValue ? <div className="text-xs text-ink/60">Min ₹{o.minOrderValue}</div> : null}
//                       </td>
//                       <td className="px-4 py-3 text-xs whitespace-nowrap">
//                         <div>{fmtDate(o.startDate)}</div>
//                         <div className="text-ink/50">to {fmtDate(o.endDate)}</div>
//                       </td>
//                       <td className="px-4 py-3 text-xs whitespace-nowrap">
//                         {o.usedCount ?? 0}
//                         {o.usageLimit ? ` / ${o.usageLimit}` : " / ∞"}
//                         {o.perUserLimit ? <div className="text-ink/50">{o.perUserLimit}/user</div> : null}
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${PHASE_STYLE[phase]}`}>{phase}</span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <Toggle on={o.isActive} onClick={() => handleToggle(o)} disabled={busyId === o._id} />
//                       </td>
//                       <td className="px-4 py-3 text-right whitespace-nowrap">
//                         <button onClick={() => openEdit(o)} className="text-sm font-semibold px-2 py-1 hover:bg-ink/5 rounded">✏️ Edit</button>
//                         <button onClick={() => handleDelete(o)} disabled={busyId === o._id} className="text-sm font-semibold text-sauce px-2 py-1 hover:bg-ink/5 rounded">🗑️ Delete</button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile cards */}
//           <div className="md:hidden flex flex-col gap-3">
//             {offers.map((o) => {
//               const phase = getPhase(o);
//               return (
//                 <div key={o._id} className="bg-white rounded-xl border border-ink/10 p-4">
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="min-w-0">
//                       <div className="font-bold break-words">{o.title}</div>
//                       {o.code && (
//                         <span className="inline-block mt-1 border border-dashed border-sauce text-sauce text-xs font-bold px-2 py-0.5 rounded">
//                           {o.code}
//                         </span>
//                       )}
//                     </div>
//                     <Toggle on={o.isActive} onClick={() => handleToggle(o)} disabled={busyId === o._id} />
//                   </div>

//                   <div className="mt-3 flex items-center gap-2 flex-wrap">
//                     <span className="font-extrabold text-sauce">{discountLabel(o)}</span>
//                     <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${PHASE_STYLE[phase]}`}>{phase}</span>
//                   </div>

//                   {o.description && <p className="text-xs text-ink/60 mt-2">{o.description}</p>}

//                   <div className="mt-3 text-xs text-ink/70 space-y-1">
//                     {o.minOrderValue ? <div>Min order: ₹{o.minOrderValue}</div> : null}
//                     <div>{fmtDate(o.startDate)} → {fmtDate(o.endDate)}</div>
//                     <div>
//                       Used: {o.usedCount ?? 0}
//                       {o.usageLimit ? ` / ${o.usageLimit}` : " / ∞"}
//                       {o.perUserLimit ? ` · ${o.perUserLimit}/user` : ""}
//                     </div>
//                   </div>

//                   <div className="mt-3 flex gap-2">
//                     <button onClick={() => openEdit(o)} className="flex-1 border border-ink/15 rounded-lg py-2 text-sm font-semibold">✏️ Edit</button>
//                     <button onClick={() => handleDelete(o)} disabled={busyId === o._id} className="flex-1 border border-sauce/30 text-sauce rounded-lg py-2 text-sm font-semibold">🗑️ Delete</button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center gap-3 mt-5">
//               <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded-lg border border-ink/15 text-sm font-semibold disabled:opacity-40">
//                 ← Prev
//               </button>
//               <span className="text-sm font-semibold">Page {page} / {totalPages}</span>
//               <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded-lg border border-ink/15 text-sm font-semibold disabled:opacity-40">
//                 Next →
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       <OfferFormModal
//         open={modalOpen}
//         initial={editing}
//         saving={saving}
//         error={formErr}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleSubmit}
//       />
//     </div>
//   );
// }