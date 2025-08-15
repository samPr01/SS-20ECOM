import CategoryPage from "@/components/CategoryPage";

const carMotorbikeProducts = [
  {
    id: 1101,
    name: "Car Dashboard Camera",
    price: 4999,
    originalPrice: 7999,
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 267,
    brand: "Drive Safe",
  },
  {
    id: 1102,
    name: "Motorcycle Helmet",
    price: 2999,
    originalPrice: 4999,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 189,
    brand: "Safety First",
  },
  {
    id: 1103,
    name: "Car Air Freshener Set",
    price: 599,
    originalPrice: 999,
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 345,
    brand: "Fresh Drive",
  },
  {
    id: 1104,
    name: "Phone Mount for Car",
    price: 899,
    originalPrice: 1599,
    image:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 234,
    brand: "Mount Pro",
  },
  {
    id: 1105,
    name: "Car Seat Covers Set",
    price: 2499,
    originalPrice: 3999,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 156,
    brand: "Comfort Drive",
  },
  {
    id: 1106,
    name: "Motorcycle Gloves",
    price: 1299,
    originalPrice: 2199,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&q=80",
    rating: 4.1,
    reviews: 178,
    brand: "Rider Gear",
  },
  {
    id: 1107,
    name: "Car Emergency Kit",
    price: 1999,
    originalPrice: 3299,
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop&q=80",
    rating: 4.5,
    reviews: 123,
    brand: "Emergency Plus",
  },
  {
    id: 1108,
    name: "Tire Pressure Monitor",
    price: 3499,
    originalPrice: 5999,
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=300&fit=crop&q=80",
    rating: 4.4,
    reviews: 198,
    brand: "Tech Auto",
  },
  {
    id: 1109,
    name: "Bike Chain Lock",
    price: 1599,
    originalPrice: 2799,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&q=60",
    rating: 4.3,
    reviews: 145,
    brand: "Security Lock",
  },
  {
    id: 1110,
    name: "Car Floor Mats",
    price: 1899,
    originalPrice: 3199,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=300&fit=crop&q=80",
    rating: 4.2,
    reviews: 167,
    brand: "Floor Pro",
  },
];

const subcategories = [
  "Car Electronics",
  "Car Accessories",
  "Motorcycle Gear",
  "Safety Equipment",
  "Car Care",
  "Bike Accessories",
  "Car Audio",
  "Navigation",
  "Tools & Equipment",
  "Car Covers",
];

export default function CarMotorbike() {
  return (
    <CategoryPage
      title="Car & Motorbike"
      description="Essential accessories and equipment for your vehicles"
      bannerImage="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=400&fit=crop"
      products={carMotorbikeProducts}
      subcategories={subcategories}
    />
  );
}
