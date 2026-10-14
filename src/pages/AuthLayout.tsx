import type { ReactNode } from "react";

export default function AuthLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="max-w-md mx-auto px-4 py-10 sm:py-16">
      <div className="bg-white border-2 border-ink rounded-xl p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold mb-6">{title}</h1>
        {children}
      </div>
    </div>
  );
}

export const inputCls = "mt-1 w-full border-2 border-ink/30 rounded-md px-3 py-2 focus:border-ink";
export const submitCls =
  "w-full py-3 rounded-md bg-sauce text-white font-bold hover:bg-sauce-dark disabled:opacity-60";
