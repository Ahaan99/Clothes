import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useOrders } from "../contexts/OrderContext";
import { useState } from "react";

export function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const shippingRates = {
    standard: 5.99,
    express: 12.99,
    overnight: 24.99
  };

  const shipping = shippingRates[shippingMethod];

  const handlePromoCode = () => {
    const promoCodes = {
      'WELCOME10': 0.10,
      'SAVE20': 0.20
    };

    const discount = promoCodes[promoCode.toUpperCase()] || 0;
    setPromoDiscount(discount);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * promoDiscount;
  const tax = (subtotal - discountAmount) * 0.1;
  const total = subtotal - discountAmount + shipping + tax;

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const orderId = createOrder(cartItems, total);
      clearCart();
      navigate('/checkout-success', { state: { orderId } });
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                  <div className="flex items-center">
                    <img
                      src={item.preview}
                      alt={item.productType}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-lg">{item.productType}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Size: {item.size} • Color: {item.color}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 border-r hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-4 py-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 border-l hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <div className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Shipping Method</h3>
                  <div className="space-y-2">
                    {Object.entries(shippingRates).map(([method, rate]) => (
                      <label key={method} className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          value={method}
                          checked={shippingMethod === method}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="mr-2"
                        />
                        <span className="flex-1 text-sm">
                          {method.charAt(0).toUpperCase() + method.slice(1)}
                        </span>
                        <span className="text-sm font-medium">${rate.toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Promo Code</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md text-sm"
                      placeholder="Enter code"
                    />
                    <button
                      onClick={handlePromoCode}
                      className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full py-3 px-4 rounded-lg mt-6 transition ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start designing your custom apparel today!</p>
            <Link
              to="/products"
              className="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
