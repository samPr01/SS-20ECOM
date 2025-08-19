// Women Ethnic Products Dataset - 500 products
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

const generateWomenEthnicProducts = (): Product[] => {
  const brands = ["Saree Palace", "Ethnic Studio", "Royal Collection", "Indo Western", "Silk Heritage", "Handloom Studio", "Bridal Collection", "Fashion Forward", "Heritage Silk", "Ethnic Couture", "Traditional House", "Designer Studio", "Classic Ethnic", "Royal Threads", "Elegant Wear"];
  
  const productTypes = [
    "Saree", "Kurti", "Lehenga", "Anarkali Dress", "Palazzo Set", "Sharara Set", "Dupatta Set", "Ethnic Gown", 
    "Churidar Set", "Straight Suit", "A-Line Kurti", "Printed Kurti", "Embroidered Suit", "Cotton Saree", 
    "Silk Saree", "Designer Lehenga", "Party Wear Suit", "Casual Kurti", "Wedding Lehenga", "Festive Wear"
  ];
  
  const colors = ["Red", "Blue", "Green", "Pink", "Purple", "Orange", "Yellow", "Black", "White", "Maroon", "Navy", "Golden", "Silver", "Coral", "Turquoise"];
  const fabrics = ["Cotton", "Silk", "Georgette", "Chiffon", "Crepe", "Chanderi", "Banarasi", "Kanjivaram", "Linen", "Rayon", "Polyester", "Velvet", "Net", "Satin", "Organza"];
  const designs = ["Printed", "Embroidered", "Plain", "Block Print", "Digital Print", "Hand Work", "Zari Work", "Thread Work", "Sequin Work", "Mirror Work", "Beaded", "Stone Work", "Floral", "Geometric", "Traditional"];

  const images = [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1606221289778-9c4bb7bb5b8c?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=300&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1606221289778-9c4bb7bb5b8c?w=300&h=300&fit=crop&q=80"
  ];

  const products: Product[] = [];
  
  for (let i = 1; i <= 500; i++) {
    const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const fabric = fabrics[Math.floor(Math.random() * fabrics.length)];
    const design = designs[Math.floor(Math.random() * designs.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    // Generate realistic price ranges based on product type
    let basePrice = 500;
    if (productType.includes("Lehenga") || productType.includes("Wedding")) basePrice = 3000;
    else if (productType.includes("Saree") || productType.includes("Suit")) basePrice = 1200;
    else if (productType.includes("Kurti")) basePrice = 600;
    else if (productType.includes("Gown") || productType.includes("Anarkali")) basePrice = 1500;
    
    const variance = basePrice * 0.8; // 80% variance
    const price = Math.floor(basePrice + (Math.random() - 0.5) * variance);
    const originalPrice = Math.floor(price * (1.4 + Math.random() * 0.8)); // 40-120% markup
    
    const rating = Math.round((3.8 + Math.random() * 1.2) * 10) / 10; // 3.8 to 5.0
    const reviews = Math.floor(20 + Math.random() * 500); // 20 to 520 reviews
    
    products.push({
      id: 100 + i,
      name: `${design} ${color} ${fabric} ${productType}`,
      price: Math.max(price, 299), // Minimum price
      originalPrice: Math.max(originalPrice, price + 100),
      image: images[i % images.length],
      rating,
      reviews,
      brand
    });
  }
  
  return products;
};

export const womenEthnicProducts = generateWomenEthnicProducts();
