import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import { getUser, isUserFarmer } from '../utils/auth';
import Navigation from '../components/Navigation';
import '../styles/AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Price: '',
    Stock: '',
    CategoryID: '',
    Image: null,
  });

  useEffect(() => {
    if (!user || !isUserFarmer()) {
      navigate('/');
      return;
    }
    loadCategories();
  }, [user, navigate]);

  const loadCategories = async () => {
    try {
      const data = await categoryAPI.getCategories();
      setCategories(data.categories || []);
    } catch (err) {
      setError('Не вдалося завантажити категорії');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        Image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.Name || !formData.Price || !formData.Stock || !formData.CategoryID) {
      setError('Заповніть всі обов\'язкові поля');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('Name', formData.Name);
      data.append('Description', formData.Description);
      data.append('Price', formData.Price);
      data.append('Stock', formData.Stock);
      data.append('CategoryID', formData.CategoryID);

      if (formData.Image) {
        data.append('image', formData.Image);
      }

      await productAPI.createProduct(data);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Помилка при створенні товару');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <Navigation />

      <div className="add-product-content">
        <h2>Додати новий товар</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Назва товару *</label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              placeholder="Введіть назву товару"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Опис</label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleInputChange}
              placeholder="Опишіть товар"
              rows="5"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ціна (грн) *</label>
              <input
                type="number"
                name="Price"
                value={formData.Price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Кількість на складі *</label>
              <input
                type="number"
                name="Stock"
                value={formData.Stock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Категорія *</label>
            <select
              name="CategoryID"
              value={formData.CategoryID}
              onChange={handleInputChange}
              disabled={loading || categories.length === 0}
              required
            >
              <option value="">Оберіть категорію</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Зображення товару</label>
            <input
              type="file"
              name="Image"
              onChange={handleFileChange}
              accept="image/*"
              disabled={loading}
            />
            {formData.Image && (
              <p className="file-name">📷 {formData.Image.name}</p>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? 'Додавання...' : 'Додати товар'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={loading}
              className="btn-cancel"
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
