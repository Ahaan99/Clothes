import { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const createOrder = (items, total) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'Processing',
      items,
      total,
      trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
    setOrders(prev => [...prev, newOrder]);
    return newOrder.id;
  };

  const getOrder = (orderId) => orders.find(order => order.id === orderId);

  return (
    <OrderContext.Provider value={{ orders, createOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
