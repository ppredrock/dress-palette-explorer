import Image from "next/image";
import Link from "next/link";
import { Filter, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dress Collection",
  description: "Browse Neha's curated dress collection — bridal, party, ethnic, and more.",
};

const categories = ["All", "Bridal", "Party", "Casual", "Ethnic", "Western", "Fusion"];

const dresses = [
  { id: "1", title: "Blush Rose Bridal Gown", category: "Bridal", rental_price: 2500, price: 45000, sizes: ["XS","S","M","L"], available: true, featured: true, image: "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&h=500&fit=crop" },
  { id: "2", title: "Midnight Sequin Party Dress", category: "Party", rental_price: 1200, price: 18000, sizes: ["S","M","L","XL"], available: true, featured: false, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop" },
  { id: "3", title: "Emerald Ethnic Anarkali", category: "Ethnic", rental_price: 1800, price: 22000, sizes: ["XS","S","M","L","XL"], available: true, featured: false, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop" },
  { id: "4", title: "Ivory Lace Cocktail Dress", category: "Western", rental_price: 1500, price: 20000, sizes: ["XS","S","M"], available: true, featured: false, image: "https://images.unsplash.com/photo-1566479179817-60aa1f3be5fc?w=400&h=500&fit=crop" },
  { id: "5", title: "Coral Fusion Saree Gown", category: "Fusion", rental_price: 2000, price: 28000, sizes: ["S","M","L"], available: true, featured: true, image: "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=400&h=500&fit=crop" },
  { id: "6", title: "Navy Blue Casual Sundress", category: "Casual", rental_price: 600, price: 5500, sizes: ["XS","S","M","L","XL"], available: false, featured: false, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop" },
];

export default function DressesPage() {
  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-12 text-center">
          <Badge className="mb-4 bg-brand-50 text-brand-600 border-brand-200 hover:bg-brand-50">
            200+ Styles Available
          </Badge>
          <h1 className="font-display text-5xl font-bold text-gray-900 mb-4">
            The Collection
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Every piece is personally curated by Neha — rent for a special day or own a favorite forever.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search dresses..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2 shrink-0">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                cat === "All"
                  ? "bg-brand-500 text-white"
                  : "bg-white text-gray-600 hover:bg-brand-50 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dresses.map((dress) => (
            <Link key={dress.id} href={`/dresses/${dress.id}`}>
              <Card className="overflow-hidden group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={dress.image}
                    alt={dress.title}
                    fill
                    className={`object-cover transition-transform duration-500 ${
                      dress.available ? "group-hover:scale-105" : "grayscale opacity-60"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Badge
                    className={`absolute top-4 left-4 border-0 ${
                      dress.available
                        ? "bg-white/90 text-gray-700"
                        : "bg-gray-800/80 text-gray-200"
                    }`}
                  >
                    {dress.available ? dress.category : "Unavailable"}
                  </Badge>
                  {dress.featured && (
                    <Badge className="absolute top-4 right-12 bg-brand-500 text-white border-0">
                      Featured
                    </Badge>
                  )}
                  <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-50">
                    <Heart className="w-4 h-4 text-brand-500" />
                  </button>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{dress.title}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-brand-500 font-medium text-sm">
                        {formatCurrency(dress.rental_price)}/day rental
                      </p>
                      <p className="text-gray-400 text-xs">
                        Buy: {formatCurrency(dress.price)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {dress.sizes.slice(0, 3).map((s) => (
                        <span key={s} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                      {dress.sizes.length > 3 && (
                        <span className="text-xs text-gray-400">+{dress.sizes.length - 3}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
