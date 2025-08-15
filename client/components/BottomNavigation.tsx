import { Home, Grid3X3, Mail, HelpCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNavigation() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Grid3X3, label: "Categories", path: "/categories" },
    { icon: Mail, label: "Mall", path: "/mall" },
    { icon: HelpCircle, label: "Help", path: "/help" },
    { icon: User, label: "Account", path: "/account" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center py-2 px-1 ${
                isActive ? "text-purple-600" : "text-gray-600"
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
