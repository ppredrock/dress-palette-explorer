export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Sparkles, LayoutDashboard, ShoppingBag, Calendar,
  FileText, MessageSquare, Users, LogOut, Settings
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

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#0F0A0D] text-gray-100 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#160B10] border-r border-[#2A1520] fixed inset-y-0 left-0 z-40">
        <div className="p-6 border-b border-[#2A1520]">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-blush-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-white block">DressPalette</span>
              <span className="text-xs text-gray-500">Admin Console</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-0.5">
          {adminLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-brand-900/20 hover:text-brand-200 transition-colors"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2A1520] space-y-0.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-brand-900/20 hover:text-brand-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
            User Dashboard
          </Link>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-brand-900/20 hover:text-brand-200 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-64 flex-1">
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
