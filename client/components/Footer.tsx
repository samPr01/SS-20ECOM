import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SS</span>
              </div>
              <span className="text-xl font-bold">SamaySagar</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted marketplace for quality products at unbeatable
              prices.
            </p>
          </div>

          {/* Women's Categories */}
          <div>
            <h3 className="font-semibold mb-4">Women</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/women-ethnic"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Women Ethnic
                </Link>
              </li>
              <li>
                <Link
                  to="/women-western"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Women Western
                </Link>
              </li>
              <li>
                <Link
                  to="/sarees"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sarees
                </Link>
              </li>
              <li>
                <Link
                  to="/kurtis"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Kurtis & Dresses
                </Link>
              </li>
              <li>
                <Link
                  to="/lehengas"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Lehengas
                </Link>
              </li>
            </ul>
          </div>

          {/* Men & Kids Categories */}
          <div>
            <h3 className="font-semibold mb-4">Men & Kids</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/men"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Men's Clothing
                </Link>
              </li>
              <li>
                <Link
                  to="/kids"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Kids Fashion
                </Link>
              </li>
              <li>
                <Link
                  to="/kids-toys"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Kids & Toys
                </Link>
              </li>
              <li>
                <Link
                  to="/bags-footwear"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Bags & Footwear
                </Link>
              </li>
              <li>
                <Link
                  to="/sports-fitness"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sports & Fitness
                </Link>
              </li>
            </ul>
          </div>

          {/* Home & Lifestyle Categories */}
          <div>
            <h3 className="font-semibold mb-4">Home & Lifestyle</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/home-kitchen"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link
                  to="/beauty-health"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Beauty & Health
                </Link>
              </li>
              <li>
                <Link
                  to="/jewellery"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Jewellery & Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/electronics"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/automotive"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Car & Motorbike
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Info */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms & Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 SamaySagar. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
