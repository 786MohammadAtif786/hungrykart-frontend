import { useState } from 'react';
import { useOffers } from '../../hooks/useOffers';
import OfferCard from '../../components/offer/OfferCard';
import OfferForm from '../../components/offer/OfferForm';
import ConfirmDialog from '../../components/offer/ConfirmDialog';
import type { CreateOfferInput, Offer } from '../../types/Offer';

const OffersPage = () => {
  const {
    offers, loading, error, filter, setFilter,
    createOffer, updateOffer, toggleStatus, deleteOffer,
  } = useOffers();

  const [formOpen, setFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<Offer | null>(null);

  const handleSubmit = async (payload: CreateOfferInput) => {
    if (editingOffer) await updateOffer(editingOffer._id, payload);
    else await createOffer(payload);
  };

  const counts = {
    all: offers.length,
    active: offers.filter((o) => o.isActive).length,
    inactive: offers.filter((o) => !o.isActive).length,
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">🏷️ Offers</h1>
          <p className="text-sm text-gray-500">Coupons, discounts aur banners manage karo</p>
        </div>
        <button
          onClick={() => { setEditingOffer(null); setFormOpen(true); }}
          className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
        >
          + Create Offer
        </button>
      </div>

      {/* Filter tabs — count ke saath */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'active', 'inactive'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${
              filter === f ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
            <span className={`ml-1.5 rounded-full px-1.5 text-[10px] ${
              filter === f ? 'bg-white/25' : 'bg-gray-200'
            }`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p className="py-10 text-center text-gray-400">Loading offers...</p>
      ) : error ? (
        <p className="py-10 text-center text-red-500">{error}</p>
      ) : offers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-400">
          Koi offer nahi mila. Pehla offer banayo! 🎉
        </div>
      ) : (
        /* ⬇️ YEH RAHA ASLI FIX — banner card full-width rahega */
        // <div className="grid grid-cols-1 gap-4">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {offers.map((offer) => (
            <OfferCard
              key={offer._id}
              offer={offer}
              isAdmin
              onEdit={(o) => { setEditingOffer(o); setFormOpen(true); }}
              onDelete={setDeletingOffer}
              onToggle={toggleStatus}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <OfferForm
        open={formOpen}
        initial={editingOffer}
        onClose={() => { setFormOpen(false); setEditingOffer(null); }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deletingOffer}
        title="Offer Delete Karo?"
        message={`"${deletingOffer?.title}" permanently delete ho jayega.`}
        onCancel={() => setDeletingOffer(null)}
        onConfirm={async () => {
          if (deletingOffer) await deleteOffer(deletingOffer._id);
          setDeletingOffer(null);
        }}
      />
    </div>
  );
};

export default OffersPage;