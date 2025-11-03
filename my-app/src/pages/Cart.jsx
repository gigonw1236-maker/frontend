import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../services/api';
import Navigation from '../components/Navigation';
import '../styles/Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await cartAPI.getCart();
      setCartItems(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError('Не вдалося завантажити кошик');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await cartAPI.removeFromCart(cartItemId);
      loadCart();
    } catch (err) {
      setError('Не вдалося видалити товар');
    }
  };

  const handleCreateOrder = async () => {
    if (cartItems.length === 0) {
      setError('Кошик порожній');
      return;
    }

    try {
      setOrderLoading(true);
      const orderData = cartItems.map(item => ({
        ProductId: item.ProductId,
        Quantity: item.Quantity,
      }));

      await orderAPI.createOrder(orderData);
      navigate('/orders');
    } catch (err) {
      setError('Помилка при створенні замовлення');
    } finally {
      setOrderLoading(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);

  return (
    <div className="cart-container">
      <Navigation />

      <div className="cart-content">
        <h2>Мій кошик</h2>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Завантаження...</div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Ваш кошик порожній</p>
            <button onClick={() => navigate('/')} className="btn-continue-shopping">
              Продовжити покупки
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.CartItemId} className="cart-item">
                  <div className="item-image">
                    {item.ImageUrl ? (
                      <img src={item.ImageUrl} alt={item.ProductName} />
                    ) : (
                      <div className="placeholder">Нема зображення</div>
                    )}
                  </div>

                  <div className="item-details">
                    <h4>{item.ProductName}</h4>
                    <p className="item-price">{item.Price.toFixed(2)} грн/шт</p>
                  </div>

                  <div className="item-quantity">
                    <p>Кількість: {item.Quantity}</p>
                  </div>

                  <div className="item-total">
                    <p>{(item.Price * item.Quantity).toFixed(2)} грн</p>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.CartItemId)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Разом</h3>
              <div className="summary-row">
                <span>Кількість товарів:</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="summary-row total">
                <span>Сума:</span>
                <span>{totalPrice.toFixed(2)} грн</span>
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={orderLoading}
                className="btn-checkout"
              >
                {orderLoading ? 'Створення замовлення...' : 'Оформити замовлення'}
              </button>

              <button
                onClick={() => navigate('/')}
                className="btn-continue"
              >
                Продовжити покупки
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
