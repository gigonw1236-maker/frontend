import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import Navigation from '../components/Navigation';
import '../styles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getOrders();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      setError('Не вдалося завантажити замовлення');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      Pending: 'Очікує',
      Processing: 'Обробляється',
      Shipped: 'Відправлено',
      Delivered: 'Доставлено',
      Cancelled: 'Скасовано',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="orders-container">
      <Navigation />

      <div className="orders-content">
        <h2>Мої замовлення</h2>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Завантаження...</div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <p>У вас ще немає замовлень</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.OrderId} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Замовлення №{order.OrderId}</h3>
                    <p className="order-date">{formatDate(order.OrderDate)}</p>
                  </div>
                  <div className={`order-status status-${order.Status.toLowerCase()}`}>
                    {getStatusLabel(order.Status)}
                  </div>
                </div>

                <div className="order-items">
                  <h4>Товари:</h4>
                  {order.items && order.items.length > 0 ? (
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.ProductName} - {item.Quantity} шт. × {item.UnitPrice.toFixed(2)} грн
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Товари не знайдені</p>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Разом:</strong>
                    <span>{order.TotalAmount.toFixed(2)} грн</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
