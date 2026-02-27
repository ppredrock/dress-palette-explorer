import Image from "next/image";
import Link from "next/link";
import { Clock, Star, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Makeup Services",
  description: "Book professional makeup services with Neha — bridal, party, and everyday looks.",
};

const services = [
  {
    id: "1",
    title: "Bridal Makeup",
    description: "Complete bridal look including airbrush foundation, eye makeup, and hair styling. Designed to last through your entire wedding celebration.",
    price: 8000,
    duration_minutes: 180,
    category: "Bridal",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&h=400&fit=crop",
    available: true,
  },
  {
    id: "2",
    title: "Party Glam",
    description: "Make a statement at any celebration. Bold eyes, perfect lips, and luminous skin that photographs beautifully.",
    price: 3500,
    duration_minutes: 90,
    category: "Party",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=400&fit=crop",
    available: true,
  },
  {
    id: "3",
    title: "Natural Glow",
    description: "Everyday enhancement that brings out your natural beauty. Lightweight coverage, subtle definition, and a healthy glow.",
    price: 1800,
    duration_minutes: 60,
    category: "Natural",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500&h=400&fit=crop",
    available: true,
  },
  {
    id: "4",
    title: "Editorial Makeup",
    description: "Creative, avant-garde looks for shoots, events, and those who dare to be different. Collaborative and artistic.",
    price: 5500,
    duration_minutes: 120,
    category: "Editorial",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&h=400&fit=crop",
    available: true,
  },
];

const whyNeha = [
  { icon: "🎓", title: "Certified Artist", desc: "Trained at top beauty academies" },
  { icon: "💄", title: "Premium Products", desc: "MAC, NARS, Charlotte Tilbury" },
  { icon: "📸", title: "Photo-Ready", desc: "Looks that shine on camera" },
  { icon: "❤️", title: "Personal Touch", desc: "Every client is unique" },
];

export default function MakeupPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blush-50 to-rose-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-white text-brand-600 border-brand-200 hover:bg-white">
                Professional Makeup Artist
              </Badge>
              <h1 className="font-display text-5xl font-bold text-gray-900 mb-6">
                Makeup by <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blush-500">Neha</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                From breathtaking bridal looks to everyday glam — Neha transforms faces with artistry,
                care, and a passion for making you feel your absolute best.
              </p>
              <div className="flex gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    <Calendar className="w-5 h-5" />
                    Book Now
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span>500+ happy clients</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=750&fit=crop"
                  alt="Neha doing makeup"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Neha */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {whyNeha.map((item) => (
              <div key={item.title} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-brand-50 transition-colors">
                <span className="text-3xl block mb-3">{item.icon}</span>
                <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-3">
              Services & Pricing
            </h2>
            <p className="text-gray-500">Choose the look that speaks to you</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden group border-0 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 border-0">
                    {service.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-xl font-semibold text-gray-900">
                      {service.title}
                    </h3>
                    <span className="font-bold text-brand-500 text-lg whitespace-nowrap ml-4">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {service.duration_minutes >= 60
                        ? `${Math.floor(service.duration_minutes / 60)}h${service.duration_minutes % 60 > 0 ? ` ${service.duration_minutes % 60}m` : ""}`
                        : `${service.duration_minutes}m`
                      }
                    </div>
                    <Link href={`/register?service=${service.id}`}>
                      <Button size="sm" className="gap-1.5">
                        Book <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
