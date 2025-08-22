import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PlaceholderPageProps {
  title: string;
  description: string;
  features?: string[];
}

export default function PlaceholderPage({
  title,
  description,
  features,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardHeader className="pb-8">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Construction className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                {title}
              </CardTitle>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {description}
              </p>
            </CardHeader>

            <CardContent className="pb-8">
              {features && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Coming Soon Features:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center text-left">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button size="lg" className="px-6 py-3">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-6 py-3">
                  Notify When Ready
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
