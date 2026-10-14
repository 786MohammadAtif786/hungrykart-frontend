import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "My Orders", to: "/orders" },
];

const CATEGORIES = ["Pizza", "Burger", "Fries", "Momos", "Shake", "Dessert"];

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "X", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative bg-ink text-white mt-16">
      {/* top accent strip */}
      <div aria-hidden className="h-1.5 bg-gradient-to-r from-sauce via-cheese to-sauce" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight">
              <span aria-hidden>🍕</span>
              Hungry<span className="text-sauce">Kart</span>
            </Link>
            <p className="mt-3 text-sm text-white/65 leading-relaxed max-w-xs">
              Fresh ingredients, great taste and fast delivery. Pizza, burgers and more, hot at your doorstep.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-white/80 hover:bg-sauce hover:border-sauce hover:text-white transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-cheese">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-white/70 hover:text-white hover:pl-1 transition-all">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-cheese">Popular Categories</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link to="/" className="text-white/70 hover:text-white hover:pl-1 transition-all">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-cheese">Contact Us</h3>
            <ul className="mt-4 space-y-3.5 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-sauce" />
                <span>Your address line, City, State - 000000</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-sauce" />
                <a href="tel:+910000000000" className="hover:text-white">+91 00000 00000</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-sauce" />
                <a href="mailto:support@hungrykart.com" className="hover:text-white">support@hungrykart.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-sauce" />
                <span>Open daily, 10 AM - 11 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-white/55">
          <p>© {new Date().getFullYear()} HungeryKart. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <span aria-hidden>•</span>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}