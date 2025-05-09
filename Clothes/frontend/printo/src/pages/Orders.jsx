import { useNavigate, Link } from "react-router-dom";
import { useOrders } from "../contexts/OrderContext";

export function Orders() {
  const { orders } = useOrders();
  const navigate = useNavigate();

  const handleTrackOrder = (trackingNumber) => {
    window.open(`/track-order/${trackingNumber}`, '_blank');
  };

  const handleBuyAgain = (orderId) => {
    buyAgain(orderId);
    navigate('/cart');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Shipped": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{order.id}</h3>
                      <p className="text-sm text-gray-600">
                        Ordered on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center py-4">
                        <img
                          src={item.preview}
                          alt={item.productType}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium">{item.productType}</h4>
                          <p className="text-sm text-gray-600">
                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                    <span className="font-semibold">Total: ${order.total.toFixed(2)}</span>
                    <div className="space-x-4">
                      <button 
                        onClick={() => handleTrackOrder(order.trackingNumber)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                      >
                        Track Order
                      </button>
                      <button 
                        onClick={() => handleBuyAgain(order.id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                      >
                        Buy Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here</p>
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
