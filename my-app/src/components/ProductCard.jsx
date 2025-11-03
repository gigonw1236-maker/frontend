import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';
import { getUser } from '../utils/auth';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const user = getUser();
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await cartAPI.addToCart(product.ProductId, 1);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error('Помилка додавання в кошик:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.ImageUrl ? (
          <img src={product.ImageUrl} alt={product.ProductName} />
        ) : (
          <div className="placeholder-image">Зображення відсутнє</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.ProductName}</h3>

        <p className="product-description">
          {product.Description?.substring(0, 80)}...
        </p>

        <div className="product-footer">
          <div className="price">
            {product.Price.toFixed(2)} грн
          </div>

          <div className="stock-info">
            {product.StockQuantity > 0 ? (
              <span className="in-stock">В наявності</span>
            ) : (
              <span className="out-of-stock">Нема в наявності</span>
            )}
          </div>
        </div>

        <div className="card-actions">
          <button
            onClick={handleViewDetails}
            className="btn-details"
          >
            Деталі
          </button>

          <button
            onClick={handleAddToCart}
            disabled={loading || product.StockQuantity === 0}
            className={`btn-cart ${addedToCart ? 'added' : ''}`}
          >
            {addedToCart ? '✓ Додано' : 'В кошик'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
