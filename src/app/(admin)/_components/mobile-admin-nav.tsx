"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu, X, Sparkles, LayoutDashboard, ShoppingBag, Calendar,
  FileText, MessageSquare, Users, LogOut, Settings,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/dresses", label: "Dresses", icon: ShoppingBag },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/makeup", label: "Makeup Services", icon: Sparkles },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function MobileAdminNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <header className="bg-[#160B10] border-b border-[#2A1520] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <Link href="/admin" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="font-display font-bold text-sm text-white block">DressPalette</span>
            <span className="text-[10px] text-gray-500">Admin Console</span>
          </div>
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-brand-900/30"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {open && (
        <div className="bg-[#160B10] border-b border-[#2A1520]">
          <nav className="p-4 space-y-0.5">
            {adminLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-brand-900/30 hover:text-gold-300 transition-colors"
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-[#2A1520] space-y-0.5">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-brand-900/30 hover:text-gold-300 transition-colors"
            >
              <Settings className="w-4 h-4" />
              User Dashboard
            </Link>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-brand-900/30 hover:text-gold-300 transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
