import Link from "next/link";
import Image from "next/image";
import { desc, eq } from "drizzle-orm";
import { ArrowRight, Sparkles, Heart, Star, Calendar, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { dresses, makeup_services } from "@/db/schema";

export const dynamic = "force-dynamic";

const MAKEUP_ICONS: Record<string, string> = {
  bridal: "💍",
  party: "✨",
  natural: "🌸",
  editorial: "📸",
  special_effects: "🎭",
  other: "💄",
};

const testimonials = [
  { name: "Priya S.", text: "Neha made me look absolutely stunning on my wedding day. The makeup lasted all 12 hours!", rating: 5 },
  { name: "Aisha K.", text: "The dress collection is gorgeous — I rented the sequin dress for my birthday and got so many compliments!", rating: 5 },
  { name: "Ritika M.", text: "Love the lifestyle content. Neha's fashion tips are so practical and inspiring.", rating: 5 },
];

export default async function HomePage() {
  // Fetch featured dresses; fall back to most recent available if fewer than 3.
  const featuredDresses = await db
    .select()
    .from(dresses)
    .where(eq(dresses.featured, true))
    .orderBy(desc(dresses.created_at))
    .limit(3);

  if (featuredDresses.length < 3) {
    const recent = await db
      .select()
      .from(dresses)
      .where(eq(dresses.available, true))
      .orderBy(desc(dresses.created_at))
      .limit(6);
    const seen = new Set(featuredDresses.map((d) => d.id));
    for (const d of recent) {
      if (featuredDresses.length >= 3) break;
      if (!seen.has(d.id)) {
        featuredDresses.push(d);
        seen.add(d.id);
      }
    }
  }

  const makeupServices = await db
    .select()
    .from(makeup_services)
    .where(eq(makeup_services.available, true))
    .limit(3);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FDFAF7]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <Badge className="mb-6" variant="default">
                <Sparkles className="w-3 h-3 mr-1" /> Welcome to Neha&apos;s Studio
              </Badge>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Dress.{" "}
                <span className="text-gradient-gold italic">
                  Glow.
                </span>{" "}
                Inspire.
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-lg">
                Curated dress collections, expert makeup artistry, and a lifestyle world that inspires —
                all in one cozy digital boutique crafted by Neha.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/dresses">
                  <Button size="lg" className="gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Browse Dresses
                  </Button>
                </Link>
                <Link href="/makeup">
                  <Button size="lg" variant="outline" className="gap-2">
                    Book Makeup
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-[#E8D5C8]">
                {[
                  { value: "200+", label: "Dress Styles" },
                  { value: "500+", label: "Happy Clients" },
                  { value: "5★", label: "Avg Rating" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image collage */}
            <div className="relative hidden lg:block h-[600px]">
              <div className="absolute right-0 top-0 w-64 h-80 rounded-3xl overflow-hidden shadow-warm-lg rotate-3">
                <Image
                  src="https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&h=500&fit=crop"
                  alt="Bridal dress"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute right-40 top-32 w-56 h-72 rounded-3xl overflow-hidden shadow-warm-md -rotate-2">
                <Image
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop"
                  alt="Makeup"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute right-8 bottom-8 w-52 h-64 rounded-3xl overflow-hidden shadow-warm-sm rotate-1">
                <Image
                  src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop"
                  alt="Party dress"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating review card */}
              <div className="absolute left-0 bottom-20 bg-white rounded-2xl border border-[#E8D5C8] shadow-warm-md p-4 w-48 animate-fade-in">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-3 h-3 text-gold-400 fill-gold-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-800">&ldquo;Absolutely stunning!&rdquo;</p>
                <p className="text-xs text-gray-500 mt-0.5">— Priya, Bridal Client</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dresses */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className="mb-4" variant="default">
              New Arrivals
            </Badge>
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Carefully curated pieces for every occasion — rent for a day or make them yours.
            </p>
          </div>

          {featuredDresses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDresses.map((dress) => (
                <Link key={dress.id} href={`/dresses/${dress.id}`}>
                  <Card className="overflow-hidden group cursor-pointer border border-[#E8D5C8] shadow-warm-sm hover:shadow-warm-md transition-all duration-300">
                    <div className="relative h-72 overflow-hidden bg-gray-100">
                      {dress.images?.[0] ? (
                        <Image
                          src={dress.images[0]}
                          alt={dress.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Badge className="absolute top-4 left-4 bg-white/90 text-gray-700 border-0 normal-case tracking-normal text-xs capitalize">
                        {dress.category}
                      </Badge>
                      <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-50">
                        <Heart className="w-4 h-4 text-brand-600" />
                      </button>
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{dress.title}</h3>
                      <p className="text-brand-700 font-medium text-sm">
                        ₹{(dress.rental_price ?? 0).toLocaleString("en-IN")}/day rental
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              New pieces are landing soon — check back!
            </p>
          )}

          <div className="text-center mt-10">
            <Link href="/dresses">
              <Button variant="outline" size="lg" className="gap-2">
                View All Dresses <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Makeup Services — dark luxury section */}
      <section className="py-24 bg-[#1A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-700/40 bg-white/10 px-3 py-0.5 text-[10px] font-medium uppercase tracking-widest text-gold-300 mb-4">
                <Sparkles className="w-3 h-3" /> Makeup by Neha
              </div>
              <h2 className="font-display text-4xl font-bold text-[#F5EDE8] mb-6">
                Transform Your Look
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                From ethereal bridal looks to bold party glam — Neha brings years of artistry
                and a deep love for beauty to every appointment.
              </p>
              <div className="space-y-4">
                {makeupServices.length > 0 ? (
                  makeupServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/8 transition-colors"
                    >
                      <span className="text-2xl">
                        {MAKEUP_ICONS[service.category] ?? "💄"}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#F5EDE8]">{service.title}</h4>
                        {service.description && (
                          <p className="text-sm text-gray-500">{service.description}</p>
                        )}
                      </div>
                      <span className="text-gold-400 font-semibold text-sm whitespace-nowrap">
                        From ₹{service.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Services coming soon.
                  </p>
                )}
              </div>
              <Link href="/makeup" className="mt-8 inline-block">
                <Button variant="gold" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </Button>
              </Link>
            </div>
            <div className="relative hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-warm-xl aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=750&fit=crop"
                  alt="Makeup artistry"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#FDFAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
              Loved by Clients
            </h2>
            <p className="text-gray-500">Real stories from Neha&apos;s community</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-[#E8D5C8] rounded-2xl shadow-warm-sm p-6">
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-gray-900 text-sm">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-800 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-6 text-gold-400 opacity-90" />
          <h2 className="font-display text-4xl font-bold mb-4">
            Ready to Explore?
          </h2>
          <p className="text-brand-200 text-lg mb-8">
            Join Neha&apos;s growing community. Create your account and unlock your personal dashboard.
          </p>
          <Link href="/register">
            <Button variant="gold" size="lg" className="gap-2">
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
