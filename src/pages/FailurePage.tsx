import React from 'react';
import { XCircle } from 'lucide-react';

const FailurePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">We couldn't process your payment. Please try again.</p>
        <a 
          href="/"
          className="inline-block bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Try Again
        </a>
      </div>
    </div>
  );
};

export default FailurePage;