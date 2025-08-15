import CategoryPage from "@/components/CategoryPage";

const kidsProducts = [
  {
    id: 401,
    name: "Baby Cotton Romper Set",
    price: 699,
    originalPrice: 1199,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 234,
    brand: "Little Angels",
  },
  {
    id: 402,
    name: "Kids Cartoon T-Shirt",
    price: 399,
    originalPrice: 699,
    image:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 189,
    brand: "Fun Wear",
  },
  {
    id: 403,
    name: "Girl's Party Dress",
    price: 1299,
    originalPrice: 2199,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 156,
    brand: "Princess Collection",
  },
  {
    id: 404,
    name: "Educational Puzzle Toy",
    price: 899,
    originalPrice: 1499,
    image:
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 245,
    brand: "Learning Toys",
  },
  {
    id: 405,
    name: "Kids Denim Jacket",
    price: 1199,
    originalPrice: 1999,
    image:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&h=300&fit=crop&q=80",
    rating: 4.4,
    reviews: 167,
    brand: "Mini Fashion",
  },
  {
    id: 406,
    name: "Building Blocks Set",
    price: 1599,
    originalPrice: 2699,
    image:
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=300&fit=crop&q=80",
    rating: 4.8,
    reviews: 198,
    brand: "Creative Toys",
  },
  {
    id: 407,
    name: "School Backpack",
    price: 799,
    originalPrice: 1399,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 134,
    brand: "School Essentials",
  },
  {
    id: 408,
    name: "Baby Soft Toy",
    price: 599,
    originalPrice: 999,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&q=80",
    rating: 4.5,
    reviews: 223,
    brand: "Cuddly Friends",
  },
  {
    id: 409,
    name: "Kids Sports Shoes",
    price: 1499,
    originalPrice: 2499,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 178,
    brand: "Active Kids",
  },
  {
    id: 410,
    name: "Art & Craft Kit",
    price: 899,
    originalPrice: 1599,
    image:
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=300&fit=crop&q=60",
    rating: 4.6,
    reviews: 145,
    brand: "Creative Corner",
  },
];

const subcategories = [
  "Baby Clothing",
  "Boys Clothing",
  "Girls Clothing",
  "Toys & Games",
  "School Supplies",
  "Footwear",
  "Baby Care",
  "Books & Learning",
];

export default function Kids() {
  return (
    <CategoryPage
      title="Kids & Toys"
      description="Everything for your little ones - clothing, toys, and essentials"
      bannerImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop"
      products={kidsProducts}
      subcategories={subcategories}
    />
  );
}
