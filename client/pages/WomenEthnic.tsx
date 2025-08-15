import CategoryPage from "@/components/CategoryPage";

const womenEthnicProducts = [
  {
    id: 101,
    name: "Beautiful Red Saree with Golden Border",
    price: 1899,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 245,
    brand: "Saree Palace"
  },
  {
    id: 102,
    name: "Cotton Printed Kurti Set",
    price: 799,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 189,
    brand: "Ethnic Studio"
  },
  {
    id: 103,
    name: "Designer Lehenga Choli Set",
    price: 4999,
    originalPrice: 8999,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 156,
    brand: "Royal Collection"
  },
  {
    id: 104,
    name: "Embroidered Anarkali Dress",
    price: 2199,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1606221289778-9c4bb7bb5b8c?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 203,
    brand: "Indo Western"
  },
  {
    id: 105,
    name: "Traditional Silk Saree",
    price: 3299,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop&q=80",
    rating: 4.6,
    reviews: 167,
    brand: "Silk Heritage"
  },
  {
    id: 106,
    name: "Block Print Cotton Kurti",
    price: 699,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=300&h=300&fit=crop&q=80",
    rating: 4.2,
    reviews: 134,
    brand: "Handloom Studio"
  },
  {
    id: 107,
    name: "Wedding Lehenga with Heavy Work",
    price: 7999,
    originalPrice: 14999,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop&q=80",
    rating: 4.8,
    reviews: 98,
    brand: "Bridal Collection"
  },
  {
    id: 108,
    name: "Georgette Palazzo Set",
    price: 1299,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1606221289778-9c4bb7bb5b8c?w=300&h=300&fit=crop&q=80",
    rating: 4.3,
    reviews: 145,
    brand: "Fashion Forward"
  },
  {
    id: 109,
    name: "Chanderi Silk Dupatta Set",
    price: 1899,
    originalPrice: 3499,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop&q=60",
    rating: 4.5,
    reviews: 178,
    brand: "Heritage Silk"
  },
  {
    id: 110,
    name: "Embroidered Sharara Set",
    price: 2799,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop&q=60",
    rating: 4.4,
    reviews: 123,
    brand: "Ethnic Couture"
  }
];

const subcategories = [
  "Sarees", "Kurtis & Suits", "Lehengas", "Anarkali Dresses", 
  "Palazzo Sets", "Sharara Sets", "Dupatta Sets", "Ethnic Gowns"
];

export default function WomenEthnic() {
  return (
    <CategoryPage
      title="Women Ethnic"
      description="Discover beautiful traditional and ethnic wear for women"
      bannerImage="https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=1200&h=400&fit=crop"
      products={womenEthnicProducts}
      subcategories={subcategories}
    />
  );
}
