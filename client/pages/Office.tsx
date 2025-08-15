import CategoryPage from "@/components/CategoryPage";

const officeProducts = [
  {
    id: 1201,
    name: "Ergonomic Office Chair",
    price: 8999,
    originalPrice: 14999,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 234,
    brand: "Comfort Office"
  },
  {
    id: 1202,
    name: "Wireless Keyboard & Mouse",
    price: 2499,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 345,
    brand: "Tech Workspace"
  },
  {
    id: 1203,
    name: "Study Table with Drawers",
    price: 6999,
    originalPrice: 11999,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&q=80",
    rating: 4.5,
    reviews: 167,
    brand: "Furniture Plus"
  },
  {
    id: 1204,
    name: "Notebook & Pen Set",
    price: 599,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 456,
    brand: "Write Pro"
  },
  {
    id: 1205,
    name: "Desktop Organizer",
    price: 1299,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&q=70",
    rating: 4.3,
    reviews: 189,
    brand: "Organize It"
  },
  {
    id: 1206,
    name: "LED Monitor 24 inch",
    price: 12999,
    originalPrice: 18999,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 123,
    brand: "Display Pro"
  },
  {
    id: 1207,
    name: "File Folders Set",
    price: 899,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=300&fit=crop&q=80",
    rating: 4.1,
    reviews: 234,
    brand: "Office Essentials"
  },
  {
    id: 1208,
    name: "Printer All-in-One",
    price: 8499,
    originalPrice: 12999,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 178,
    brand: "Print Master"
  },
  {
    id: 1209,
    name: "Whiteboard with Markers",
    price: 1999,
    originalPrice: 3499,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 145,
    brand: "Meeting Room"
  },
  {
    id: 1210,
    name: "Table Lamp Adjustable",
    price: 1599,
    originalPrice: 2799,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 198,
    brand: "Light Work"
  }
];

const subcategories = [
  "Office Furniture", "Computer Accessories", "Stationery", "Printers & Scanners", "Storage", 
  "Desk Accessories", "Office Electronics", "Lighting", "Office Supplies", "Conference Room"
];

export default function Office() {
  return (
    <CategoryPage
      title="Office Supplies"
      description="Complete range of office furniture, electronics, and stationery"
      bannerImage="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop"
      products={officeProducts}
      subcategories={subcategories}
    />
  );
}
