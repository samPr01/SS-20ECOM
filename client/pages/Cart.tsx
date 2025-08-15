import PlaceholderPage from "@/components/PlaceholderPage";

export default function Cart() {
  const features = [
    "Product quantity adjustment and removal",
    "Real-time price calculations and totals",
    "Apply discount codes and coupons",
    "Shipping cost calculation",
    "Saved items and move to wishlist",
    "Guest and user checkout options",
    "Multiple payment methods support",
    "Order summary and confirmation"
  ];

  return (
    <PlaceholderPage
      title="Shopping Cart"
      description="This page will allow you to review your selected items, adjust quantities, apply discounts, and proceed to checkout."
      features={features}
    />
  );
}
