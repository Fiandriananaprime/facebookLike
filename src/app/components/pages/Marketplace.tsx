import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, MapPin, Filter, Heart } from "lucide-react";

const categories = [
  "All",
  "Vehicles",
  "Electronics",
  "Furniture",
  "Fashion",
  "Sports",
  "Home & Garden",
  "Music",
];

const mockListings = [
  {
    id: 1,
    title: "Mountain Bike - Like New",
    price: "$450",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1607998527053-4c70fd6841b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwYmlrZSUyMHNhbGV8ZW58MXx8fHwxNzcyNjMzNDEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    time: "2 days ago",
  },
  {
    id: 2,
    title: "Modern Gray Sofa",
    price: "$800",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1768946052273-0a2dd7f3e365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXR1cmUlMjBzb2ZhfGVufDF8fHx8MTc3MjYzMzQxMnww&ixlib=rb-4.1.0&q=80&w=1080",
    time: "5 hours ago",
  },
  {
    id: 3,
    title: "Professional Camera Equipment",
    price: "$1,200",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1729655669048-a667a0b01148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzI2MjU3OTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    time: "1 day ago",
  },
  {
    id: 4,
    title: "Vintage Acoustic Guitar",
    price: "$650",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1758002102952-6d61ea980980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZ3VpdGFyJTIwbXVzaWNhbHxlbnwxfHx8fDE3NzI2MzM0MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    time: "3 days ago",
  },
  {
    id: 5,
    title: "MacBook Pro 2024",
    price: "$2,100",
    location: "Seattle, WA",
    image: "https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2t8ZW58MXx8fHwxNzcyNjEwNTU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    time: "1 hour ago",
  },
  {
    id: 6,
    title: "Designer Sneakers Collection",
    price: "$180",
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1771874621249-e188866fe1d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NzI1NDMyNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    time: "4 days ago",
  },
];

export function Marketplace() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-screen-2xl mx-auto p-4 pb-20 md:pb-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Marketplace</h1>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search Marketplace"
                className="pl-10 bg-white"
              />
            </div>
            <Button variant="outline" className="gap-2 bg-white">
              <MapPin className="w-4 h-4" />
              Location
            </Button>
            <Button variant="outline" className="gap-2 bg-white">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className={`whitespace-nowrap ${
                category === "All" ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockListings.map((listing) => (
            <Card
              key={listing.id}
              className="bg-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
            >
              <div className="relative">
                <ImageWithFallback
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-4">
                <p className="text-xl font-bold mb-1">{listing.price}</p>
                <h3 className="font-medium mb-2 line-clamp-2">{listing.title}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location}</span>
                </div>
                <p className="text-sm text-gray-500">{listing.time}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Sell Button */}
        <Button
          size="lg"
          className="fixed bottom-20 md:bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 shadow-lg z-40"
        >
          + Sell Item
        </Button>
      </div>
    </div>
  );
}
