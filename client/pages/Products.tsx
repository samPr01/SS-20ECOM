import PlaceholderPage from "@/components/PlaceholderPage";

export default function Products() {
  const features = [
    "Advanced filtering by category, price, brand, and ratings",
    "Sort by popularity, price, ratings, and newest arrivals",
    "Product comparison functionality",
    "Wishlist and save for later options",
    "Quick view and zoom functionality",
    "Bulk ordering capabilities",
  ];

  return (
    <PlaceholderPage
      title="Product Listing Page"
      description="This page will display all products with advanced filtering and sorting options. You'll be able to browse through our entire catalog with powerful search and discovery features."
      features={features}
    />
  );
}
