import { useCallback, useEffect, useState } from 'react';
import {
  createOfferApi,
  deleteOfferApi,
  getAllOffers,
  toggleOfferStatusApi,
  updateOfferApi,
} from '../api/Offer';
import type { CreateOfferInput, Offer } from '../types/Offer';

export const useOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const isActive = filter === 'all' ? undefined : filter === 'active';
      const res = await getAllOffers(1, isActive);
      setOffers(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Offers load nahi ho paye');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const createOffer = async (payload: CreateOfferInput) => {
    await createOfferApi(payload);
    await fetchOffers();
  };

  const updateOffer = async (id: string, payload: Partial<CreateOfferInput>) => {
    await updateOfferApi(id, payload);
    await fetchOffers();
  };

  const toggleStatus = async (offer: Offer) => {
    // Optimistic update
    setOffers((prev) =>
      prev.map((o) => (o._id === offer._id ? { ...o, isActive: !o.isActive } : o))
    );
    try {
      await toggleOfferStatusApi(offer._id, !offer.isActive);
    } catch {
      await fetchOffers(); // fail hua to wapas
    }
  };

  const deleteOffer = async (id: string) => {
    await deleteOfferApi(id);
    setOffers((prev) => prev.filter((o) => o._id !== id));
  };

  return {
    offers,
    loading,
    error,
    filter,
    setFilter,
    createOffer,
    updateOffer,
    toggleStatus,
    deleteOffer,
    refetch: fetchOffers,
  };
};