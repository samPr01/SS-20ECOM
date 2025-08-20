import React from 'react';
import { useNavigate } from 'react-router-dom';

export function CancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="text-yellow-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout Cancelled</h1>
          <p className="text-gray-600 mb-6">
            Your checkout was cancelled. No charges were made to your account.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/cart')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Return to Cart
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
