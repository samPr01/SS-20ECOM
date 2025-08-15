import CategoryPage from "@/components/CategoryPage";

const bagsFootwearProducts = [
  {
    id: 901,
    name: "Women's Running Shoes",
    price: 2999,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 356,
    brand: "SportFit"
  },
  {
    id: 902,
    name: "Leather Office Bag",
    price: 3499,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 234,
    brand: "Professional"
  },
  {
    id: 903,
    name: "Casual Sneakers",
    price: 2299,
    originalPrice: 3799,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 289,
    brand: "Street Style"
  },
  {
    id: 904,
    name: "Designer Handbag",
    price: 4999,
    originalPrice: 8999,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 167,
    brand: "Luxury Collection"
  },
  {
    id: 905,
    name: "Formal Dress Shoes",
    price: 3799,
    originalPrice: 6299,
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 178,
    brand: "Formal Wear"
  },
  {
    id: 906,
    name: "Travel Backpack",
    price: 2799,
    originalPrice: 4599,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&q=80",
    rating: 4.4,
    reviews: 245,
    brand: "Adventure Gear"
  },
  {
    id: 907,
    name: "High Heel Sandals",
    price: 1999,
    originalPrice: 3499,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 134,
    brand: "Fashion Forward"
  },
  {
    id: 908,
    name: "Wallet with Card Holder",
    price: 1299,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 198,
    brand: "Leather Craft"
  },
  {
    id: 909,
    name: "Sports Shoes for Men",
    price: 3299,
    originalPrice: 5499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 267,
    brand: "Athletic Pro"
  },
  {
    id: 910,
    name: "College Backpack",
    price: 1899,
    originalPrice: 3199,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&q=60",
    rating: 4.3,
    reviews: 156,
    brand: "Student Essential"
  }
];

const subcategories = [
  "Running Shoes", "Casual Shoes", "Formal Shoes", "Sandals", "Handbags", 
  "Backpacks", "Wallets", "Travel Bags", "Sports Shoes", "Office Bags"
];

export default function BagsFootwear() {
  return (
    <CategoryPage
      title="Bags & Footwear"
      description="Stylish bags and comfortable footwear for every lifestyle"
      bannerImage="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=400&fit=crop"
      products={bagsFootwearProducts}
      subcategories={subcategories}
    />
  );
}
