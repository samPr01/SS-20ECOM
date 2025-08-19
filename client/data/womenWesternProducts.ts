// Women Western Products Dataset - 500 products
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

const generateWomenWesternProducts = (): Product[] => {
  const brands = ["Urban Style", "Summer Vibes", "Denim Co", "Trendy Tops", "Fashion Forward", "Professional Wear", "Casual Chic", "Party Collection", "Classic Shirts", "Comfort Wear", "Modern Woman", "Style Studio", "Chic Collection", "Elite Fashion", "Contemporary"];
  
  const productTypes = [
    "Dress", "Top", "Jeans", "Skirt", "Jumpsuit", "Blazer", "Shirt", "Shorts", "Co-ord Set", "Trousers",
    "Maxi Dress", "Mini Dress", "Midi Dress", "Crop Top", "Tank Top", "Blouse", "Cardigan", "Jacket",
    "Palazzo", "Culottes", "High Waist Jeans", "Skinny Jeans", "Wide Leg Pants", "Leggings", "Jeggings"
  ];
  
  const colors = ["Black", "White", "Blue", "Red", "Pink", "Green", "Yellow", "Purple", "Orange", "Brown", "Grey", "Navy", "Maroon", "Olive", "Beige"];
  const patterns = ["Solid", "Striped", "Polka Dot", "Floral", "Geometric", "Abstract", "Animal Print", "Checked", "Plaid", "Tropical", "Vintage", "Modern", "Ethnic", "Bohemian", "Minimalist"];
  const fits = ["Regular Fit", "Slim Fit", "Relaxed Fit", "Oversized", "Fitted", "A-Line", "Straight", "Bootcut", "Skinny", "Wide Leg"];

  const images = [
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1564257577-4b60ad8e9a2f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop&q=70",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=300&h=300&fit=crop&q=80"
  ];

  const products: Product[] = [];
  
  for (let i = 1; i <= 500; i++) {
    const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const fit = fits[Math.floor(Math.random() * fits.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    // Generate realistic price ranges based on product type
    let basePrice = 800;
    if (productType.includes("Blazer") || productType.includes("Jacket")) basePrice = 2000;
    else if (productType.includes("Dress") || productType.includes("Jumpsuit")) basePrice = 1500;
    else if (productType.includes("Jeans") || productType.includes("Trousers")) basePrice = 1200;
    else if (productType.includes("Top") || productType.includes("Shirt")) basePrice = 700;
    else if (productType.includes("Shorts") || productType.includes("Skirt")) basePrice = 900;
    
    const variance = basePrice * 0.7;
    const price = Math.floor(basePrice + (Math.random() - 0.5) * variance);
    const originalPrice = Math.floor(price * (1.3 + Math.random() * 0.9));
    
    const rating = Math.round((3.7 + Math.random() * 1.3) * 10) / 10;
    const reviews = Math.floor(15 + Math.random() * 400);
    
    products.push({
      id: 600 + i,
      name: `${pattern} ${color} ${fit} ${productType}`,
      price: Math.max(price, 399),
      originalPrice: Math.max(originalPrice, price + 150),
      image: images[i % images.length],
      rating,
      reviews,
      brand
    });
  }
  
  return products;
};

export const womenWesternProducts = generateWomenWesternProducts();
