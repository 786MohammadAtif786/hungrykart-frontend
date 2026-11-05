

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  applyCoupon,
  listCoupons,
  type AppliedBill,
  type AvailableCoupon,
} from "../Couponuserapi";
import { clearCoupon, getSavedCoupon, saveCoupon } from "../lib/couponStore";
import StepHeader from "../components/checkout/StepHeader";
import DeliveryDetailsStep from "../components/checkout/DeliveryDetailsStep";
import ReviewOrderStep from "../components/checkout/ReviewOrderStep";
import PaymentStep from "../components/checkout/PaymentStep";
import OrderSummary from "../components/checkout/OrderSummary";
import OrderSuccess from "../components/checkout/OrderSuccess";
import { loadRazorpay } from "../components/checkout/razorpay";
import type { Details, Errors, PaymentMethod, OrderPayloadExtra, PlacedInfo } from "../components/checkout/types";

const DELIVERY_FEE = 40;
const FREE_DELIVERY_ABOVE = 1000;
const GST_RATE = 0.05;

const inr = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

// placeOrder ke liye paymentMethod REQUIRED hai
type PlaceExtra = OrderPayloadExtra & { paymentMethod: "COD" | "ONLINE" };

function validate(d: Details): Errors {
  const e: Errors = {};
  if (d.fullName.trim().length < 2) e.fullName = "Enter your full name";
  if (!/^[6-9]\d{9}$/.test(d.phone)) e.phone = "Enter a valid 10-digit mobile number";
  if (d.address.trim().length < 10) e.address = "Enter your full address (house no., area, city)";
  return e;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user, token, loading } = useAuth();
  const { items, subtotal, clearCart, openCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [details, setDetails] = useState<Details>({
    fullName: "",
    phone: "",
    address: "",
    landmark: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("RAZORPAY");
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<PlacedInfo | null>(null);

  // ---- coupon ----
  const [savedCode, setSavedCode] = useState<string | null>(() => getSavedCoupon());
  const [bill, setBill] = useState<AppliedBill | null>(null); // server ka bill (coupon valid hone ke baad)
  const [promo, setPromo] = useState("");
  const [applying, setApplying] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponNote, setCouponNote] = useState("");
  const billKey = useRef("");

  // ---- available coupons list ----
  const [availableCoupons, setAvailableCoupons] = useState<AvailableCoupon[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(false);

  const lines = () => items.map((i) => ({ productId: i.product._id, quantity: i.qty }));
  const itemsKey = items.map((i) => `${i.product._id}:${i.qty}`).join("|");

  useEffect(() => {
    if (!user) return;
    setDetails((d) => ({
      ...d,
      fullName: d.fullName || user.name || "",
      phone: d.phone || String((user as { mobile?: string }).mobile ?? ""),
    }));
  }, [user]);

  // Cart drawer me lagaya coupon yahan dobara server se verify hota hai (cart badle to bhi)
  useEffect(() => {
    if (!token || !savedCode || items.length === 0) {
      setBill(null);
      return;
    }
    if (billKey.current === `${savedCode}|${itemsKey}`) return;

    let alive = true;
    setCouponLoading(true);
    applyCoupon(token, savedCode, lines())
      .then((r) => {
        if (!alive) return;
        billKey.current = `${savedCode}|${itemsKey}`;
        setBill(r);
        setCouponNote("");
      })
      .catch((e) => {
        if (!alive) return;
        clearCoupon();
        billKey.current = "";
        setSavedCode(null);
        setBill(null);
        setCouponNote(`${savedCode} removed: ${e instanceof Error ? e.message : "not valid"}`);
      })
      .finally(() => alive && setCouponLoading(false));

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, savedCode, itemsKey]);

  // Available coupons list — ek baar load hoti hai
  useEffect(() => {
    if (!token) return;
    let alive = true;
    setCouponsLoading(true);
    listCoupons(token)
      .then((list) => alive && setAvailableCoupons(list))
      .catch(() => {}) // silently fail — coupon input to kaam karega hi
      .finally(() => alive && setCouponsLoading(false));
    return () => {
      alive = false;
    };
  }, [token]);

  // coupon code se direct apply (list se click karne par)
  const applyPromoWith = async (codeParam?: string) => {
    const code = (codeParam ?? promo).trim().toUpperCase();
    if (!code) return setCouponNote("Enter a coupon code");
    if (!token || applying) return;

    setApplying(true);
    setCouponNote("");
    try {
      const r = await applyCoupon(token, code, lines());
      saveCoupon(r.code);
      billKey.current = `${r.code}|${itemsKey}`;
      setSavedCode(r.code);
      setBill(r);
      setPromo("");
    } catch (e) {
      setCouponNote(e instanceof Error ? e.message : "Could not apply coupon");
    } finally {
      setApplying(false);
    }
  };

  // input + Apply button wala flow
  const applyPromo = () => applyPromoWith();

  const removeCoupon = () => {
    clearCoupon();
    billKey.current = "";
    setSavedCode(null);
    setBill(null);
    setCouponNote("");
  };

  // ---- bill: coupon laga ho to server ke numbers, warna local ----
  const localFee = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const localTax = Math.round(subtotal * GST_RATE);
  const deliveryFee = bill ? bill.deliveryFee : localFee;
  const tax = bill ? bill.tax : localTax;
  const discount = bill ? bill.discount : 0;
  const total = bill ? bill.total : subtotal + localFee + localTax;
  const couponCode = bill?.code;

  const handleFieldChange = (key: keyof Details, value: string) =>
    setDetails((d) => ({ ...d, [key]: value }));

  const continueFromDetails = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(details);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep(2);
  };

  const markPlaced = (order: { _id?: string; orderNumber?: string }) => {
    clearCart();
    clearCoupon(); // order ho gaya, coupon yaad rakhne ki zarurat nahi
    setPlaced({
      id: order?._id,
      orderNumber: order?.orderNumber,
      address: details.address.trim(),
      landmark: details.landmark.trim() || undefined,
      phone: details.phone,
    });
  };

  // Common part: items + delivery details + coupon (paymentMethod yahan nahi)
  const buildBase = () => ({
    items: lines(),
    deliveryDetails: {
      fullName: details.fullName.trim(),
      phone: details.phone,
      address: details.address.trim(),
      landmark: details.landmark.trim(),
    },
    ...(couponCode ? { couponCode } : {}),
  });

  // placeOrder wala payload: paymentMethod required
  const buildPayload = (extra: PlaceExtra) => ({
    ...buildBase(),
    ...extra,
  });

  /* ---------- COD order ---------- */
  const placeOrder = async () => {
    if (!token) return;
    setPlacing(true);
    setError("");
    try {
      const order = await api.placeOrder(token, buildPayload({ paymentMethod: "COD" }));
      markPlaced(order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  /* ---------- Razorpay online payment ---------- */
  const payWithRazorpay = async () => {
    if (!token) return;
    setPlacing(true);
    setError("");
    try {
      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) {
        throw new Error("Razorpay load nahi hua. Internet connection check karo.");
      }

      // 1) Backend se Razorpay order id lo.
      //    items + couponCode bhi ja rahe hain: backend final amount (discount ke baad) khud nikalega.
      const rzpOrder = await api.createRazorpayOrder(token, {
        ...buildBase(),
        amount: total,
      });

      const rzp = new window.Razorpay({
        key: rzpOrder.keyId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || "INR",
        order_id: rzpOrder.id,
        name: "HungryKart",
        description: "Food order payment",
        prefill: { name: details.fullName, contact: details.phone },
        theme: { color: "#e23744" },
        handler: async (res: any) => {
          try {
            // 2) Signature backend par verify karo
            await api.verifyRazorpayPayment(token, {
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
            });
            // 3) Order place karo
            const order = await api.placeOrder(
              token,
              buildPayload({
                paymentMethod: "ONLINE",
                paymentId: res.razorpay_payment_id,
                razorpayOrderId: res.razorpay_order_id,
              })
            );
            markPlaced(order);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Payment verify nahi hui");
          } finally {
            setPlacing(false);
          }
        },
        modal: { ondismiss: () => setPlacing(false) },
      });

      rzp.on("payment.failed", (resp: any) => {
        setPlacing(false);
        setError(resp?.error?.description || "Payment failed. Dobara try karo.");
      });

      rzp.open();
    } catch (err) {
      setPlacing(false);
      setError(err instanceof Error ? err.message : "Payment start nahi hui");
    }
  };

  const handlePay = () => {
    if (placing || couponLoading || applying) return;
    if (paymentMethod === "COD") return placeOrder();
    return payWithRazorpay();
  };

  /* ---------- Different screens ---------- */

  if (placed) return <OrderSuccess order={placed} />;

  if (loading) return <p className="p-8 text-center">Loading…</p>;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold">Log in to checkout</h1>
        <p className="mt-2 text-gray-500">Your cart will be saved.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/login" className="px-5 py-2.5 rounded-lg bg-sauce text-white font-semibold">
            Log in
          </Link>
          <Link to="/register" className="px-5 py-2.5 rounded-lg border border-gray-300 font-semibold">
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Add some pizza or burgers to get started.</p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 rounded-lg bg-sauce text-white font-semibold"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  /* ---------- Main checkout ---------- */

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-xl leading-none"
        >
          ←
        </button>
        <h1 className="text-2xl font-extrabold">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* LEFT: steps */}
        <div className="space-y-4">
          {/* Step 1 */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5">
            <StepHeader n={1} title="Delivery Details" active={step === 1} done={step > 1} onEdit={() => setStep(1)} />
            {step === 1 && (
              <DeliveryDetailsStep
                details={details}
                errors={errors}
                onFieldChange={handleFieldChange}
                onSubmit={continueFromDetails}
              />
            )}
            {step > 1 && (
              <p className="mt-2 ml-10 text-sm text-gray-500">
                {details.fullName} · {details.phone}
              </p>
            )}
          </section>

          {/* Step 2 */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5">
            <StepHeader n={2} title="Review Order" active={step === 2} done={step > 2} onEdit={() => setStep(2)} />
            {step === 2 && <ReviewOrderStep items={items} details={details} onContinue={() => setStep(3)} />}
          </section>

          {/* Step 3 */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5">
            <StepHeader n={3} title="Place Order" active={step === 3} done={false} />
            {step === 3 && (
              <PaymentStep
                paymentMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
                total={total}
                placing={placing}
                error={error}
                onPay={handlePay}
              />
            )}
          </section>
        </div>

        {/* RIGHT: coupon + summary */}
        <div className="space-y-4">
          <section className="bg-white border border-gray-200 rounded-2xl p-4" aria-label="Coupon">
            {bill && couponCode ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 rounded-lg border border-green-300 bg-green-50 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-green-800 truncate">🎟 {couponCode} applied</p>
                    <p className="text-xs text-green-700">You save {inr(discount)} on this order</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="shrink-0 text-xs font-bold text-sauce underline hover:no-underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex justify-between text-sm font-semibold text-green-700">
                  <span>Coupon discount</span>
                  <span>− {inr(discount)}</span>
                </div>
                <p className="text-xs text-gray-500">The total below already includes this discount.</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold mb-2">Have a coupon?</p>
                <div className="flex gap-2">
                  <input
                    value={promo}
                    onChange={(e) => {
                      setPromo(e.target.value.toUpperCase());
                      if (couponNote) setCouponNote("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                    placeholder="Enter promo code"
                    aria-label="Promo code"
                    maxLength={20}
                    autoComplete="off"
                    spellCheck={false}
                    className="flex-1 min-w-0 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm uppercase placeholder:normal-case focus:border-sauce outline-none"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    disabled={applying}
                    className="px-4 py-2 rounded-lg bg-sauce/15 text-sauce font-bold text-sm hover:bg-sauce hover:text-white transition-colors disabled:opacity-60"
                  >
                    {applying ? "Checking…" : "Apply"}
                  </button>
                </div>
              </div>
            )}

            {/* ---- Available coupons list (input ke neeche) ---- */}
            {!bill && (
              <div className="mt-3 border-t border-dashed border-gray-200 pt-3">
                <p className="text-xs font-bold text-gray-500 mb-2">
                  {couponsLoading
                    ? "Loading offers…"
                    : availableCoupons.length > 0
                      ? "Available offers"
                      : ""}
                </p>

                {availableCoupons.length > 0 && (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {availableCoupons.map((c) => {
                      const minOrder = c.minimumOrderAmount ?? 0;
                      const underMin = subtotal < minOrder;
                      const label =
                        c.discountType === "PERCENT"
                          ? `${c.discountValue}% OFF${c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ""}`
                          : c.discountType === "FLAT"
                            ? `₹${c.discountValue} OFF`
                            : "BUY 1 GET 1";
                      return (
                        <button
                          key={c.code}
                          type="button"
                          disabled={underMin || applying}
                          onClick={() => applyPromoWith(c.code)}
                          className={`w-full text-left rounded-lg border px-3 py-2 transition-colors ${
                            underMin
                              ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                              : "border-gray-200 bg-gray-50 hover:border-sauce hover:bg-sauce/5"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-extrabold tracking-wide text-sauce">
                              {c.code}
                            </span>
                            <span className="text-xs font-bold text-gray-800">{label}</span>
                          </div>
                          {c.description && (
                            <p className="mt-0.5 text-[11px] text-gray-500 line-clamp-1">
                              {c.description}
                            </p>
                          )}
                          <p className="text-[10px] text-gray-400">
                            {underMin
                              ? `Add ₹${(minOrder - subtotal).toLocaleString("en-IN")} more to use`
                              : minOrder > 0
                                ? `On orders above ₹${minOrder.toLocaleString("en-IN")}`
                                : "No minimum order"}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {couponNote && (
              <p role="alert" className="mt-2 text-xs font-semibold text-sauce">
                {couponNote}
              </p>
            )}
          </section>

          <OrderSummary
            items={items}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            tax={tax}
            total={total}
            freeDeliveryAbove={FREE_DELIVERY_ABOVE}
            step={step}
            placing={placing}
            paymentMethod={paymentMethod}
            error={error}
            onEditCart={openCart}
            onPay={handlePay}
          />
        </div>
      </div>
    </div>
  );
}