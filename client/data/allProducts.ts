// Comprehensive Products Dataset - All Categories
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  brand?: string;
}

// Generic images for different categories
const categoryImages = {
  womenEthnic: [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1606221289778-9c4bb7bb5b8c?w=300&h=300&fit=crop",
  ],
  womenWestern: [
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1564257577-4b60ad8e9a2f?w=300&h=300&fit=crop",
  ],
  men: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop",
  ],
  kids: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=300&fit=crop",
  ],
  electronics: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1609592818230-2f227c20b2df?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
  ],
  homeKitchen: [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=300&fit=crop",
  ],
  beauty: [
    "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
  ],
  jewellery: [
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop",
  ],
  bags: [
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop",
  ],
  sports: [
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop",
  ],
  automotive: [
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop",
  ],
  office: [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop",
  ],
};

// Product data definitions for each category
const productDefinitions = {
  womenEthnic: {
    brands: [
      "Saree Palace",
      "Ethnic Studio",
      "Royal Collection",
      "Indo Western",
      "Silk Heritage",
      "Handloom Studio",
      "Bridal Collection",
      "Fashion Forward",
      "Heritage Silk",
      "Ethnic Couture",
    ],
    types: [
      "Saree",
      "Kurti",
      "Lehenga",
      "Anarkali Dress",
      "Palazzo Set",
      "Sharara Set",
      "Dupatta Set",
      "Ethnic Gown",
      "Churidar Set",
      "Straight Suit",
    ],
    descriptors: [
      "Embroidered",
      "Printed",
      "Plain",
      "Block Print",
      "Digital Print",
      "Hand Work",
      "Zari Work",
      "Thread Work",
      "Sequin Work",
      "Mirror Work",
    ],
    basePrice: 800,
    priceVariance: 0.8,
  },
  womenWestern: {
    brands: [
      "Urban Style",
      "Summer Vibes",
      "Denim Co",
      "Trendy Tops",
      "Fashion Forward",
      "Professional Wear",
      "Casual Chic",
      "Party Collection",
      "Classic Shirts",
      "Comfort Wear",
    ],
    types: [
      "Dress",
      "Top",
      "Jeans",
      "Skirt",
      "Jumpsuit",
      "Blazer",
      "Shirt",
      "Shorts",
      "Co-ord Set",
      "Trousers",
    ],
    descriptors: [
      "Solid",
      "Striped",
      "Polka Dot",
      "Floral",
      "Geometric",
      "Abstract",
      "Animal Print",
      "Checked",
      "Plaid",
      "Tropical",
    ],
    basePrice: 900,
    priceVariance: 0.7,
  },
  men: {
    brands: [
      "Urban Basics",
      "Professional",
      "Denim Studio",
      "Sport Classic",
      "Casual Wear",
      "Street Style",
      "Traditional",
      "Summer Collection",
      "Formal Wear",
      "Athletic Wear",
    ],
    types: [
      "T-Shirt",
      "Shirt",
      "Jeans",
      "Polo",
      "Chinos",
      "Hoodie",
      "Kurta",
      "Shorts",
      "Blazer",
      "Track Suit",
    ],
    descriptors: [
      "Cotton",
      "Formal",
      "Slim Fit",
      "Regular Fit",
      "Casual",
      "Sports",
      "Ethnic",
      "Cargo",
      "Designer",
      "Premium",
    ],
    basePrice: 700,
    priceVariance: 0.8,
  },
  kids: {
    brands: [
      "Little Angels",
      "Fun Wear",
      "Princess Collection",
      "Learning Toys",
      "Mini Fashion",
      "Creative Toys",
      "School Essentials",
      "Cuddly Friends",
      "Active Kids",
      "Creative Corner",
    ],
    types: [
      "Romper",
      "T-Shirt",
      "Dress",
      "Toy",
      "Jacket",
      "Building Blocks",
      "Backpack",
      "Soft Toy",
      "Shoes",
      "Art Kit",
    ],
    descriptors: [
      "Baby",
      "Cartoon",
      "Party",
      "Educational",
      "Cotton",
      "Creative",
      "School",
      "Sports",
      "Colorful",
      "Interactive",
    ],
    basePrice: 500,
    priceVariance: 0.9,
  },
  electronics: {
    brands: [
      "Audio Pro",
      "FitTech",
      "Power Plus",
      "Sound Box",
      "Connect Pro",
      "Tech Accessories",
      "Mobile Guard",
      "Light Tech",
      "Video Pro",
      "Game Master",
    ],
    types: [
      "Headphones",
      "Watch",
      "Power Bank",
      "Speaker",
      "Cable",
      "Mouse",
      "Phone Case",
      "Lamp",
      "Webcam",
      "Keyboard",
    ],
    descriptors: [
      "Wireless",
      "Smart",
      "Bluetooth",
      "USB",
      "LED",
      "Gaming",
      "HD",
      "Fast Charging",
      "Portable",
      "Premium",
    ],
    basePrice: 1500,
    priceVariance: 1.2,
  },
};

// Generate products for a specific category
function generateCategoryProducts(
  category: keyof typeof productDefinitions,
  count: number,
  startId: number,
): Product[] {
  const products: Product[] = [];
  const def = productDefinitions[category];
  const images = categoryImages[category] || categoryImages.electronics;

  for (let i = 0; i < count; i++) {
    const type = def.types[Math.floor(Math.random() * def.types.length)];
    const descriptor =
      def.descriptors[Math.floor(Math.random() * def.descriptors.length)];
    const brand = def.brands[Math.floor(Math.random() * def.brands.length)];

    const variance = def.basePrice * def.priceVariance;
    const price = Math.floor(def.basePrice + (Math.random() - 0.5) * variance);
    const originalPrice = Math.floor(price * (1.4 + Math.random() * 0.8));

    const rating = Math.round((3.8 + Math.random() * 1.2) * 10) / 10;
    const reviews = Math.floor(20 + Math.random() * 500);

    products.push({
      id: startId + i,
      name: `${descriptor} ${type}`,
      price: Math.max(price, 199),
      originalPrice: Math.max(originalPrice, price + 100),
      image: images[i % images.length],
      rating,
      reviews,
      brand,
    });
  }

  return products;
}

// Export all category products
export const allProducts = {
  womenEthnic: generateCategoryProducts("womenEthnic", 500, 1000),
  womenWestern: generateCategoryProducts("womenWestern", 500, 1500),
  men: generateCategoryProducts("men", 400, 2000),
  kids: generateCategoryProducts("kids", 400, 2400),
  electronics: generateCategoryProducts("electronics", 450, 2800),
  homeKitchen: [
    ...Array(450)
      .fill(0)
      .map((_, i) => ({
        id: 3250 + i,
        name: `Kitchen ${["Cookware Set", "Coffee Mug", "Storage Container", "Table Lamp", "Wall Art", "Knife Set", "Bed Sheet", "Pressure Cooker", "Cushion Cover", "Electric Kettle"][i % 10]}`,
        price: 500 + Math.floor(Math.random() * 2000),
        originalPrice: 800 + Math.floor(Math.random() * 3000),
        image: categoryImages.homeKitchen[i % 4],
        rating: 3.8 + Math.random() * 1.2,
        reviews: 20 + Math.floor(Math.random() * 300),
        brand: [
          "Kitchen Pro",
          "Coffee Culture",
          "Organize It",
          "Light Up",
          "Art House",
        ][i % 5],
      })),
  ],
  beauty: [
    ...Array(400)
      .fill(0)
      .map((_, i) => ({
        id: 3700 + i,
        name: `Beauty ${["Face Cream", "Serum", "Brush Set", "Hair Oil", "Lipstick", "Face Mask", "Hair Straightener", "Perfume", "Body Lotion", "Eye Shadow"][i % 10]}`,
        price: 400 + Math.floor(Math.random() * 1500),
        originalPrice: 600 + Math.floor(Math.random() * 2000),
        image: categoryImages.beauty[i % 4],
        rating: 4.0 + Math.random() * 1.0,
        reviews: 30 + Math.floor(Math.random() * 400),
        brand: [
          "Natural Glow",
          "Skin Care Pro",
          "Beauty Tools",
          "Hair Essentials",
          "Color Pop",
        ][i % 5],
      })),
  ],
  jewellery: [
    ...Array(350)
      .fill(0)
      .map((_, i) => ({
        id: 4100 + i,
        name: `${["Gold", "Silver", "Diamond", "Pearl", "Designer"][i % 5]} ${["Necklace", "Earrings", "Ring", "Bracelet", "Watch"][i % 5]}`,
        price: 800 + Math.floor(Math.random() * 8000),
        originalPrice: 1200 + Math.floor(Math.random() * 12000),
        image: categoryImages.jewellery[i % 4],
        rating: 4.2 + Math.random() * 0.8,
        reviews: 50 + Math.floor(Math.random() * 200),
        brand: [
          "Golden Heritage",
          "Silver Craft",
          "Luxury Gems",
          "Pearl Collection",
          "Time Style",
        ][i % 5],
      })),
  ],
  bags: [
    ...Array(350)
      .fill(0)
      .map((_, i) => ({
        id: 4450 + i,
        name: `${["Women's", "Men's", "Casual", "Formal", "Sports"][i % 5]} ${["Running Shoes", "Handbag", "Sneakers", "Office Bag", "Backpack"][i % 5]}`,
        price: 1000 + Math.floor(Math.random() * 3000),
        originalPrice: 1500 + Math.floor(Math.random() * 4000),
        image: categoryImages.bags[i % 4],
        rating: 4.1 + Math.random() * 0.9,
        reviews: 40 + Math.floor(Math.random() * 350),
        brand: [
          "SportFit",
          "Professional",
          "Street Style",
          "Luxury Collection",
          "Adventure Gear",
        ][i % 5],
      })),
  ],
  sports: [
    ...Array(350)
      .fill(0)
      .map((_, i) => ({
        id: 4800 + i,
        name: `Sports ${["Yoga Mat", "Dumbbells", "Cricket Bat", "Football", "Gym Gloves", "Resistance Bands", "Swimming Goggles", "Badminton Racket", "Protein Shaker", "Treadmill"][i % 10]}`,
        price: 500 + Math.floor(Math.random() * 5000),
        originalPrice: 800 + Math.floor(Math.random() * 7000),
        image: categoryImages.sports[i % 4],
        rating: 4.0 + Math.random() * 1.0,
        reviews: 25 + Math.floor(Math.random() * 300),
        brand: [
          "Fitness Pro",
          "Strength Max",
          "Cricket Pro",
          "Sports Zone",
          "Workout Gear",
        ][i % 5],
      })),
  ],
  automotive: [
    ...Array(300)
      .fill(0)
      .map((_, i) => ({
        id: 5150 + i,
        name: `Car ${["Dashboard Camera", "Helmet", "Air Freshener", "Phone Mount", "Seat Covers", "Gloves", "Emergency Kit", "Tire Monitor", "Chain Lock", "Floor Mats"][i % 10]}`,
        price: 600 + Math.floor(Math.random() * 3000),
        originalPrice: 900 + Math.floor(Math.random() * 4000),
        image: categoryImages.automotive[i % 4],
        rating: 4.1 + Math.random() * 0.9,
        reviews: 30 + Math.floor(Math.random() * 250),
        brand: [
          "Drive Safe",
          "Safety First",
          "Fresh Drive",
          "Mount Pro",
          "Comfort Drive",
        ][i % 5],
      })),
  ],
  office: [
    ...Array(250)
      .fill(0)
      .map((_, i) => ({
        id: 5450 + i,
        name: `Office ${["Chair", "Keyboard", "Table", "Notebook", "Organizer", "Monitor", "File Folders", "Printer", "Whiteboard", "Lamp"][i % 10]}`,
        price: 800 + Math.floor(Math.random() * 4000),
        originalPrice: 1200 + Math.floor(Math.random() * 6000),
        image: categoryImages.office[i % 4],
        rating: 4.2 + Math.random() * 0.8,
        reviews: 35 + Math.floor(Math.random() * 200),
        brand: [
          "Comfort Office",
          "Tech Workspace",
          "Furniture Plus",
          "Write Pro",
          "Organize It",
        ][i % 5],
      })),
  ],
};

// Get mixed products for home page (30 products from all categories)
export const homePageProducts = [
  ...allProducts.womenEthnic.slice(0, 5),
  ...allProducts.womenWestern.slice(0, 5),
  ...allProducts.men.slice(0, 4),
  ...allProducts.kids.slice(0, 3),
  ...allProducts.electronics.slice(0, 4),
  ...allProducts.homeKitchen.slice(0, 3),
  ...allProducts.beauty.slice(0, 3),
  ...allProducts.jewellery.slice(0, 3),
];
