import CategoryPage from "@/components/CategoryPage";

const jewelleryAccessoriesProducts = [
  {
    id: 801,
    name: "Gold Plated Necklace Set",
    price: 2499,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 267,
    brand: "Golden Heritage"
  },
  {
    id: 802,
    name: "Silver Jhumka Earrings",
    price: 1299,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 189,
    brand: "Silver Craft"
  },
  {
    id: 803,
    name: "Diamond Studded Ring",
    price: 15999,
    originalPrice: 25999,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop",
    rating: 4.8,
    reviews: 134,
    brand: "Luxury Gems"
  },
  {
    id: 804,
    name: "Pearl Bracelet",
    price: 1899,
    originalPrice: 3299,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 156,
    brand: "Pearl Collection"
  },
  {
    id: 805,
    name: "Designer Watch for Women",
    price: 3999,
    originalPrice: 6999,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 245,
    brand: "Time Style"
  },
  {
    id: 806,
    name: "Leather Handbag",
    price: 2799,
    originalPrice: 4599,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 178,
    brand: "Fashion Bags"
  },
  {
    id: 807,
    name: "Sunglasses Classic",
    price: 1599,
    originalPrice: 2799,
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 167,
    brand: "Vision Style"
  },
  {
    id: 808,
    name: "Hair Accessories Set",
    price: 899,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop",
    rating: 4.1,
    reviews: 123,
    brand: "Hair Glam"
  },
  {
    id: 809,
    name: "Traditional Bangles Set",
    price: 1199,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop&q=80",
    rating: 4.5,
    reviews: 198,
    brand: "Ethnic Jewels"
  },
  {
    id: 810,
    name: "Men's Chain Bracelet",
    price: 2299,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop&q=80",
    rating: 4.3,
    reviews: 145,
    brand: "Men's Collection"
  }
];

const subcategories = [
  "Necklaces", "Earrings", "Rings", "Bracelets", "Watches", 
  "Handbags", "Sunglasses", "Hair Accessories", "Bangles", "Men's Jewellery"
];

export default function JewelleryAccessories() {
  return (
    <CategoryPage
      title="Jewellery & Accessories"
      description="Beautiful jewellery and stylish accessories for every occasion"
      bannerImage="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=400&fit=crop"
      products={jewelleryAccessoriesProducts}
      subcategories={subcategories}
    />
  );
}
