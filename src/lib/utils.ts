export const formatINR = (n: number): string =>
  `₹${n.toLocaleString('en-IN')}`;

export const formatDate = (d: string): string =>
  new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/** datetime-local input ke liye "2026-10-31T23:59" format */
export const toInputDate = (d: string): string => {
  const date = new Date(d);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};