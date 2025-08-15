import CategoryPage from "@/components/CategoryPage";

const womenWesternProducts = [
  {
    id: 201,
    name: "Casual Denim Jacket",
    price: 1299,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 167,
    brand: "Urban Style"
  },
  {
    id: 202,
    name: "Floral Print Maxi Dress",
    price: 1899,
    originalPrice: 3299,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 234,
    brand: "Summer Vibes"
  },
  {
    id: 203,
    name: "High Waist Jeans",
    price: 1599,
    originalPrice: 2799,
    image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 189,
    brand: "Denim Co"
  },
  {
    id: 204,
    name: "Off Shoulder Top",
    price: 899,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1564257577-4b60ad8e9a2f?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 145,
    brand: "Trendy Tops"
  },
  {
    id: 205,
    name: "A-Line Mini Skirt",
    price: 1199,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop&q=70",
    rating: 4.3,
    reviews: 123,
    brand: "Fashion Forward"
  },
  {
    id: 206,
    name: "Blazer Set",
    price: 2499,
    originalPrice: 4299,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop&q=80",
    rating: 4.6,
    reviews: 198,
    brand: "Professional Wear"
  },
  {
    id: 207,
    name: "Crop Top & Shorts Set",
    price: 1399,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop&q=80",
    rating: 4.1,
    reviews: 167,
    brand: "Casual Chic"
  },
  {
    id: 208,
    name: "Evening Cocktail Dress",
    price: 2799,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=300&h=300&fit=crop&q=80",
    rating: 4.7,
    reviews: 134,
    brand: "Party Collection"
  },
  {
    id: 209,
    name: "Striped Button Down Shirt",
    price: 1099,
    originalPrice: 1899,
    image: "https://images.unsplash.com/photo-1564257577-4b60ad8e9a2f?w=300&h=300&fit=crop&q=80",
    rating: 4.4,
    reviews: 156,
    brand: "Classic Shirts"
  },
  {
    id: 210,
    name: "Wide Leg Palazzo Pants",
    price: 1299,
    originalPrice: 2299,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop&q=60",
    rating: 4.3,
    reviews: 178,
    brand: "Comfort Wear"
  }
];

const subcategories = [
  "Dresses", "Tops & Tunics", "Jeans & Trousers", "Skirts", 
  "Jumpsuits", "Blazers", "Shirts", "Shorts", "Co-ord Sets"
];

export default function WomenWestern() {
  return (
    <CategoryPage
      title="Women Western"
      description="Trendy western wear collection for modern women"
      bannerImage="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=400&fit=crop"
      products={womenWesternProducts}
      subcategories={subcategories}
    />
  );
}
