import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { getUser } from '../utils/auth';
import Navigation from '../components/Navigation';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserData();
  }, [user, navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await authAPI.getUserById(user.id);
      setUserData(data.user);
      setFormData(data.user);
    } catch (err) {
      setError('Не вдалося завантажити профіль');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await authAPI.updateUser(user.id, formData);
      setUserData(formData);
      setEditMode(false);
      setError('');
    } catch (err) {
      setError('Помилка при оновленні профілю');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Navigation />
        <div className="loading">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Navigation />

      <div className="profile-content">
        <h2>Мій профіль</h2>

        {error && <div className="error-message">{error}</div>}

        {userData && (
          <>
            {!editMode ? (
              <div className="profile-view">
                <div className="profile-card">
                  <div className="profile-header">
                    <h3>{userData.UserName}</h3>
                    <span className={`role-badge role-${userData.Role.toLowerCase()}`}>
                      {userData.Role === 'Farmer' ? 'Фермер' : 'Покупець'}
                    </span>
                  </div>

                  <div className="profile-info">
                    <div className="info-row">
                      <label>Ім'я:</label>
                      <span>{userData.UserName}</span>
                    </div>

                    <div className="info-row">
                      <label>Електронна пошта:</label>
                      <span>{userData.Email}</span>
                    </div>

                    <div className="info-row">
                      <label>Роль:</label>
                      <span>{userData.Role === 'Farmer' ? 'Фермер' : 'Покупець'}</span>
                    </div>

                    {userData.CreatedAt && (
                      <div className="info-row">
                        <label>Зареєстрований:</label>
                        <span>
                          {new Date(userData.CreatedAt).toLocaleDateString('uk-UA')}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setEditMode(true)}
                    className="btn-edit"
                  >
                    Редагувати профіль
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="profile-edit">
                <div className="form-group">
                  <label>Ім'я користувача</label>
                  <input
                    type="text"
                    name="UserName"
                    value={formData.UserName || ''}
                    onChange={handleInputChange}
                    disabled={updating}
                  />
                </div>

                <div className="form-group">
                  <label>Електронна пошта</label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email || ''}
                    onChange={handleInputChange}
                    disabled={updating}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={updating}
                    className="btn-save"
                  >
                    {updating ? 'Збереження...' : 'Зберегти'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setFormData(userData);
                    }}
                    disabled={updating}
                    className="btn-cancel"
                  >
                    Скасувати
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
