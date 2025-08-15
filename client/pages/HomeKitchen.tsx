import CategoryPage from "@/components/CategoryPage";

const homeKitchenProducts = [
  {
    id: 501,
    name: "Non-Stick Cookware Set",
    price: 2999,
    originalPrice: 4999,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 234,
    brand: "Kitchen Pro",
  },
  {
    id: 502,
    name: "Ceramic Coffee Mug Set",
    price: 799,
    originalPrice: 1299,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 189,
    brand: "Coffee Culture",
  },
  {
    id: 503,
    name: "Storage Container Set",
    price: 1499,
    originalPrice: 2499,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 167,
    brand: "Organize It",
  },
  {
    id: 504,
    name: "Table Lamp",
    price: 1299,
    originalPrice: 2199,
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 145,
    brand: "Light Up",
  },
  {
    id: 505,
    name: "Decorative Wall Art",
    price: 899,
    originalPrice: 1599,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&q=80",
    rating: 4.4,
    reviews: 123,
    brand: "Art House",
  },
  {
    id: 506,
    name: "Kitchen Knife Set",
    price: 1899,
    originalPrice: 3199,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&q=80",
    rating: 4.6,
    reviews: 198,
    brand: "Chef's Choice",
  },
  {
    id: 507,
    name: "Bed Sheet Set",
    price: 1599,
    originalPrice: 2799,
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 176,
    brand: "Comfort Sleep",
  },
  {
    id: 508,
    name: "Pressure Cooker",
    price: 2299,
    originalPrice: 3799,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&q=60",
    rating: 4.5,
    reviews: 156,
    brand: "Quick Cook",
  },
  {
    id: 509,
    name: "Cushion Cover Set",
    price: 699,
    originalPrice: 1199,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&q=60",
    rating: 4.2,
    reviews: 134,
    brand: "Home Decor",
  },
  {
    id: 510,
    name: "Electric Kettle",
    price: 1299,
    originalPrice: 2199,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&q=70",
    rating: 4.4,
    reviews: 189,
    brand: "Kitchen Essentials",
  },
];

const subcategories = [
  "Cookware",
  "Home Decor",
  "Storage",
  "Lighting",
  "Bedding",
  "Kitchen Appliances",
  "Dining",
  "Furniture",
  "Cleaning Supplies",
];

export default function HomeKitchen() {
  return (
    <CategoryPage
      title="Home & Kitchen"
      description="Everything you need to make your house a home"
      bannerImage="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop"
      products={homeKitchenProducts}
      subcategories={subcategories}
    />
  );
}
