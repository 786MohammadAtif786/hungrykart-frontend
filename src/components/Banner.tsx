import { ArrowRight } from "lucide-react";

export default function Banner() {
  return (
    <section className="relative isolate overflow-hidden bg-black border-b-4 border-ink">
      {/* Image: mobile par poori banner me, sm+ par right side me fade ke saath */}
      <img
        src="/pizza-banner.jpg"
        alt=""
        aria-hidden
        decoding="async"
        className={[
          "absolute inset-0 -z-10 h-full w-full object-cover object-[70%_center] select-none",
          "sm:inset-auto sm:right-0 sm:top-0 sm:w-[62%] sm:object-center",
          "sm:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.6)_25%,black_55%)]",
          "sm:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.6)_25%,black_55%)]",
        ].join(" ")}
      />

      {/* Mobile overlay: text padhne layak dark (desktop par nahi chahiye) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/25 sm:hidden"
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-12 min-h-[260px] sm:min-h-[240px] flex items-center">
        <div className="max-w-sm sm:max-w-lg">
          <h1 className="font-extrabold tracking-tight leading-tight text-white text-[1.7rem] sm:text-4xl lg:text-5xl drop-shadow-md">
            Delicious Food
            <span className="block text-red-500 sm:text-red-600">Delivered to Your Doorstep</span>
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/90 drop-shadow">
            Fresh ingredients <span className="mx-1">•</span> Great taste <span className="mx-1">•</span> Fast delivery
          </p>

          <a
            href="#menu"
            className="mt-5 sm:mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 active:scale-[0.98] transition px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Order Now
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}