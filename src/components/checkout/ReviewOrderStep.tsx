import { formatPrice } from "../ProductCard";
import type { Details } from "./types";

interface CartItem {
  product: { _id: string; name: string; price: number };
  qty: number;
}

interface Props {
  items: CartItem[];
  details: Details;
  onContinue: () => void;
}

export default function ReviewOrderStep({ items, details, onContinue }: Props) {
  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-lg bg-gray-50 p-4 text-sm">
        <p className="font-semibold">Delivering to</p>
        <p className="mt-1 text-gray-600">{details.fullName} · {details.phone}</p>
        <p className="text-gray-600">{details.address}</p>
        {details.landmark && <p className="text-gray-500">Landmark: {details.landmark}</p>}
      </div>
      <ul className="text-sm divide-y divide-gray-100">
        {items.map((i) => (
          <li key={i.product._id} className="py-2 flex justify-between gap-3">
            <span>{i.product.name} × {i.qty}</span>
            <span className="font-semibold">{formatPrice(i.product.price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onContinue}
        className="w-full py-3 rounded-lg bg-sauce text-white font-semibold hover:bg-sauce-dark"
      >
        Looks good, continue
      </button>
    </div>
  );
}