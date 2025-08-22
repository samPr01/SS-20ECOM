import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Minus,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart.tsx";
import { useProduct } from "@/hooks/useProducts";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const { product, loading, error } = useProduct(id || "");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (error) {
      toast({
        title: "Product not found",
        description: "The product you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate("/products");
    }
  }, [error, navigate, toast]);

  const handleAddToCart = () => {
    if (product) {
      // Add the product to cart with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      
      toast({
        title: "Added to cart",
        description: `${quantity} ${quantity === 1 ? 'item' : 'items'} of ${product.name} added to your cart.`,
      });
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  // Mock product images (in a real app, these would come from the product data)
  const productImages = [
    product.image,
    product.image, // You would have multiple images here
    product.image,
    product.image,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-white">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index 
                      ? "border-purple-600" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviews || 0} reviews)
                  </span>
                </div>
                
                {product.discount > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-purple-600">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-sm text-green-600 font-medium">
                  You save {formatCurrency(product.originalPrice! - product.price)}
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Product Features</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-2 text-green-600" />
                    <span>Free delivery on orders above ₹1000</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-blue-600" />
                    <span>1 year warranty</span>
                  </div>
                  <div className="flex items-center">
                    <RotateCcw className="w-4 h-4 mr-2 text-purple-600" />
                    <span>7-day return policy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
              <Separator className="mb-4" />
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Key Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>High-quality materials and construction</li>
                  <li>Durable and long-lasting design</li>
                  <li>Easy to use and maintain</li>
                  <li>Multiple color and size options available</li>
                  <li>Comes with manufacturer warranty</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-medium">Premium Brand</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Model</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Warranty</span>
                    <span className="font-medium">1 Year</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Country of Origin</span>
                    <span className="font-medium">India</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
