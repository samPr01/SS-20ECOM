import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Home, Package } from "lucide-react";
import { useAuthApi } from "@/hooks/useAuthApi";

export default function Success() {
  const [searchParams] = useSearchParams();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useAuthApi();

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        setError("No session ID found");
        setLoading(false);
        return;
      }

      try {
        const data = await api.get(`/api/payment/session/${sessionId}`);
        setSessionData(data.session);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Payment Verification Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/cart">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Return to Cart
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPaymentSuccessful = sessionData?.payment_status === 'paid';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {isPaymentSuccessful ? (
              <CheckCircle className="w-16 h-16 text-green-500" />
            ) : (
              <Package className="w-16 h-16 text-yellow-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isPaymentSuccessful ? "Payment Successful!" : "Payment Processing"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isPaymentSuccessful ? (
            <>
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Thank you for your purchase! Your payment has been processed successfully.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Amount:</strong> ${(sessionData.amount_total / 100).toFixed(2)}
                  </p>
                  <p className="text-sm text-green-700">
                    <strong>Transaction ID:</strong> {sessionData.id}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/orders">
                    <Package className="w-4 h-4 mr-2" />
                    View Orders
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Your payment is being processed. You will receive a confirmation email shortly.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    <strong>Status:</strong> {sessionData.payment_status}
                  </p>
                  <p className="text-sm text-yellow-700">
                    <strong>Session ID:</strong> {sessionData.id}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/orders">
                    <Package className="w-4 h-4 mr-2" />
                    Check Order Status
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
