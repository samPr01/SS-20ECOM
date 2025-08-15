import CategoryPage from "@/components/CategoryPage";

const sportsFitnessProducts = [
  {
    id: 1001,
    name: "Yoga Mat Premium",
    price: 1299,
    originalPrice: 2199,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 456,
    brand: "Fitness Pro",
  },
  {
    id: 1002,
    name: "Adjustable Dumbbells Set",
    price: 4999,
    originalPrice: 7999,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 234,
    brand: "Strength Max",
  },
  {
    id: 1003,
    name: "Cricket Bat Professional",
    price: 2999,
    originalPrice: 4999,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 189,
    brand: "Cricket Pro",
  },
  {
    id: 1004,
    name: "Football Official Size",
    price: 899,
    originalPrice: 1599,
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 267,
    brand: "Sports Zone",
  },
  {
    id: 1005,
    name: "Gym Gloves with Wrist Support",
    price: 799,
    originalPrice: 1399,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&q=80",
    rating: 4.2,
    reviews: 178,
    brand: "Workout Gear",
  },
  {
    id: 1006,
    name: "Resistance Bands Set",
    price: 1499,
    originalPrice: 2499,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop&q=80",
    rating: 4.4,
    reviews: 145,
    brand: "Home Fitness",
  },
  {
    id: 1007,
    name: "Swimming Goggles",
    price: 699,
    originalPrice: 1199,
    image:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&h=300&fit=crop",
    rating: 4.1,
    reviews: 123,
    brand: "Aqua Sport",
  },
  {
    id: 1008,
    name: "Badminton Racket",
    price: 1899,
    originalPrice: 3199,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&q=80",
    rating: 4.5,
    reviews: 198,
    brand: "Racket Master",
  },
  {
    id: 1009,
    name: "Protein Shaker Bottle",
    price: 399,
    originalPrice: 699,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&q=60",
    rating: 4.0,
    reviews: 234,
    brand: "Nutrition Plus",
  },
  {
    id: 1010,
    name: "Treadmill Home Use",
    price: 35999,
    originalPrice: 49999,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&q=70",
    rating: 4.7,
    reviews: 89,
    brand: "Cardio King",
  },
];

const subcategories = [
  "Gym Equipment",
  "Yoga & Fitness",
  "Cricket",
  "Football",
  "Badminton",
  "Swimming",
  "Running",
  "Cycling",
  "Outdoor Sports",
  "Fitness Accessories",
];

export default function SportsFitness() {
  return (
    <CategoryPage
      title="Sports & Fitness"
      description="Everything you need to stay active and healthy"
      bannerImage="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop"
      products={sportsFitnessProducts}
      subcategories={subcategories}
    />
  );
}
