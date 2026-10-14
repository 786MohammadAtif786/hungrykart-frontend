import type { FormEvent } from "react";
import type { Details, Errors } from "./types";

const fieldCls =
  "mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-sauce outline-none";

interface Props {
  details: Details;
  errors: Errors;
  onFieldChange: (key: keyof Details, value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function DeliveryDetailsStep({ details, errors, onFieldChange, onSubmit }: Props) {
  const handleChange =
    (key: keyof Details) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        key === "phone" ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value;
      onFieldChange(key, value);
    };

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
      <label className="block">
        <span className="text-sm font-semibold">
          Full Name <span className="text-sauce">*</span>
        </span>
        <input
          value={details.fullName}
          onChange={handleChange("fullName")}
          autoComplete="name"
          className={fieldCls}
        />
        {errors.fullName && <p className="text-sauce text-sm mt-1">{errors.fullName}</p>}
      </label>

      <label className="block">
        <span className="text-sm font-semibold">
          Phone Number <span className="text-sauce">*</span>
        </span>
        <input
          type="tel"
          inputMode="numeric"
          value={details.phone}
          onChange={handleChange("phone")}
          autoComplete="tel"
          placeholder="9876543210"
          className={fieldCls}
        />
        {errors.phone && <p className="text-sauce text-sm mt-1">{errors.phone}</p>}
      </label>

      <label className="block">
        <span className="text-sm font-semibold">
          Address <span className="text-sauce">*</span>
        </span>
        <textarea
          rows={3}
          value={details.address}
          onChange={handleChange("address")}
          autoComplete="street-address"
          placeholder="House no., street, area, city"
          className={fieldCls}
        />
        {errors.address && <p className="text-sauce text-sm mt-1">{errors.address}</p>}
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Landmark (Optional)</span>
        <input
          value={details.landmark}
          onChange={handleChange("landmark")}
          placeholder="Near metro station"
          className={fieldCls}
        />
      </label>

      <button className="w-full py-3 rounded-lg bg-sauce text-white font-semibold hover:bg-sauce-dark">
        Continue to review
      </button>
    </form>
  );
}