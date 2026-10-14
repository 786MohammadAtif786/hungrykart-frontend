import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
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

  useEffect(() => {
    if (!user) return;
    setDetails((d) => ({
      ...d,
      fullName: d.fullName || user.name || "",
      phone: d.phone || String((user as { mobile?: string }).mobile ?? ""),
    }));
  }, [user]);

  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const tax = Math.round(subtotal * GST_RATE);
  const total = subtotal + deliveryFee + tax;

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
    setPlaced({
      id: order?._id,
      orderNumber: order?.orderNumber,
      address: details.address.trim(),
      landmark: details.landmark.trim() || undefined,
      phone: details.phone,
    });
  };

  const buildPayload = (extra: OrderPayloadExtra = {}) => ({
    items: items.map((i) => ({ productId: i.product._id, quantity: i.qty })),
    deliveryDetails: {
      fullName: details.fullName.trim(),
      phone: details.phone,
      address: details.address.trim(),
      landmark: details.landmark.trim(),
    },
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

      // 1) Backend se Razorpay order id lo (items bhejo, amount nahi — backend khud calculate karega)
      const rzpOrder = await api.createRazorpayOrder(token, buildPayload());

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
    if (placing) return;
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

        {/* RIGHT: summary */}
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
  );
}