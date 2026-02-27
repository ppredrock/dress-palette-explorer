import Link from "next/link";
import { Sparkles, Instagram, Youtube, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A0D13] text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-blush-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                DressPalette
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-gray-500">
              Neha&apos;s digital studio — a cozy creative space for fashion, makeup artistry, and lifestyle inspiration.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-brand-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-brand-500 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display tracking-wider uppercase text-sm text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/dresses", label: "Dress Collection" },
                { href: "/makeup", label: "Makeup Services" },
                { href: "/lifestyle", label: "Lifestyle Blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-display tracking-wider uppercase text-sm text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/register", label: "Join Now" },
                { href: "/login", label: "Sign In" },
                { href: "/dashboard", label: "My Dashboard" },
                { href: "/dashboard/bookings", label: "My Bookings" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© 2025 DressPaletteExplorer. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-brand-500 fill-brand-500" /> by Neha
          </p>
        </div>
      </div>
    </footer>
  );
}
