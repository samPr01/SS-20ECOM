import CategoryPage from "@/components/CategoryPage";

const electronicsProducts = [
  {
    id: 701,
    name: "Wireless Bluetooth Headphones",
    price: 2999,
    originalPrice: 4999,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 345,
    brand: "Audio Pro",
  },
  {
    id: 702,
    name: "Smart Fitness Watch",
    price: 8999,
    originalPrice: 12999,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 267,
    brand: "FitTech",
  },
  {
    id: 703,
    name: "Wireless Power Bank",
    price: 1999,
    originalPrice: 3299,
    image:
      "https://images.unsplash.com/photo-1609592818230-2f227c20b2df?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 189,
    brand: "Power Plus",
  },
  {
    id: 704,
    name: "Bluetooth Speaker",
    price: 3499,
    originalPrice: 5999,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 156,
    brand: "Sound Box",
  },
  {
    id: 705,
    name: "USB Type-C Cable Set",
    price: 899,
    originalPrice: 1499,
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 234,
    brand: "Connect Pro",
  },
  {
    id: 706,
    name: "Wireless Mouse",
    price: 1499,
    originalPrice: 2499,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 178,
    brand: "Tech Accessories",
  },
  {
    id: 707,
    name: "Phone Case with Stand",
    price: 799,
    originalPrice: 1299,
    image:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop",
    rating: 4.1,
    reviews: 145,
    brand: "Mobile Guard",
  },
  {
    id: 708,
    name: "LED Desk Lamp",
    price: 2299,
    originalPrice: 3799,
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 123,
    brand: "Light Tech",
  },
  {
    id: 709,
    name: "Webcam HD",
    price: 3999,
    originalPrice: 6499,
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 198,
    brand: "Video Pro",
  },
  {
    id: 710,
    name: "Gaming Keyboard",
    price: 4999,
    originalPrice: 7999,
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 167,
    brand: "Game Master",
  },
];

const subcategories = [
  "Mobile Accessories",
  "Audio & Headphones",
  "Computers & Laptops",
  "Smart Watches",
  "Gaming",
  "Cameras",
  "Home Electronics",
  "Cables & Chargers",
  "Storage Devices",
];

export default function Electronics() {
  return (
    <CategoryPage
      title="Electronics"
      description="Latest gadgets and electronic accessories"
      bannerImage="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop"
      products={electronicsProducts}
      subcategories={subcategories}
    />
  );
}
