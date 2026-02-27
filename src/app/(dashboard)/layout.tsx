import Link from "next/link";
import { Sparkles, LayoutDashboard, ShoppingBag, Calendar, BookOpen, MessageSquare, User, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Dress Bookings", icon: ShoppingBag },
  { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/lifestyle", label: "Saved Posts", icon: BookOpen },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-50/40 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-brand-100 fixed inset-y-0 left-0 z-40">
        <div className="p-6 border-b border-brand-100">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-blush-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-gray-900">
              DressPalette
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-100">
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-blush-50 hover:text-brand-700 transition-colors w-full"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 flex-1">
        {/* Mobile top bar */}
        <header className="lg:hidden bg-white border-b border-brand-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-blush-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-base text-gray-900">DressPalette</span>
          </Link>
          <Link href="/" className="text-sm text-brand-600 font-medium">
            ← Home
          </Link>
        </header>

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
