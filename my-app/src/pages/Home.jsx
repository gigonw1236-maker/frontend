import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import { getUser, isUserFarmer } from '../utils/auth';
import ProductCard from '../components/ProductCard';
import Navigation from '../components/Navigation';
import '../styles/Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const navigate = useNavigate();
  const user = getUser();
  const isFarmer = isUserFarmer();

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getProducts();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      setError('Не вдалося завантажити товари');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryAPI.getCategories();
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) {
      console.error('Помилка завантаження категорій:', err);
      setCategories([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }

    try {
      setLoading(true);
      const data = await productAPI.searchProducts(searchQuery);
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      setError('Помилка при пошуку');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.CategoryId === parseInt(selectedCategory);
    const matchesPrice = product.Price >= minPrice && product.Price <= maxPrice;
    return matchesCategory && matchesPrice;
  });

  return (
    <div className="home-container">
      <Navigation />

      <div className="home-content">
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Пошук товарів..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">Пошук</button>
          </form>

          {isFarmer && (
            <button
              onClick={() => navigate('/add-product')}
              className="add-product-btn"
            >
              + Додати товар
            </button>
          )}
        </div>

        <div className="main-content">
          <aside className="filters">
            <div className="filter-group">
              <h3>Категорія</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="">Всі категорії</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <h3>Ціна</h3>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Від"
                  value={minPrice}
                  onChange={(e) => setMinPrice(parseFloat(e.target.value) || 0)}
                  className="price-input"
                />
                <input
                  type="number"
                  placeholder="До"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseFloat(e.target.value) || 10000)}
                  className="price-input"
                />
              </div>
            </div>
          </aside>

          <main className="products-section">
            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <div className="loading">Завантаження...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-products">Товари не знайдені</div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
