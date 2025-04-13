import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';

const OTPPage = () => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle OTP verification logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <KeyRound className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Enter OTP</h1>
          <p className="text-gray-600 mt-2">Please enter the verification code sent to your device</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter OTP"
          />
          
          <button
            type="submit"
            className="w-full mt-6 bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPPage;