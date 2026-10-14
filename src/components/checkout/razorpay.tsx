declare global {
  interface Window {
    Razorpay?: any;
  }
}

// Razorpay checkout script load karo
export const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (document.getElementById("razorpay-js")) return resolve(true);
    const s = document.createElement("script");
    s.id = "razorpay-js";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });