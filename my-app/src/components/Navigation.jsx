import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import '../styles/Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => navigate('/')}>
          🌾 HarvestMood
        </div>

        <ul className="nav-menu">
          <li>
            <a
              onClick={() => navigate('/')}
              className={`nav-link ${isActive('/')}`}
            >
              Каталог
            </a>
          </li>

          {user && (
            <>
              <li>
                <a
                  onClick={() => navigate('/cart')}
                  className={`nav-link ${isActive('/cart')}`}
                >
                  🛒 Кошик
                </a>
              </li>

              <li>
                <a
                  onClick={() => navigate('/orders')}
                  className={`nav-link ${isActive('/orders')}`}
                >
                  📋 Замовлення
                </a>
              </li>

              <li>
                <a
                  onClick={() => navigate('/profile')}
                  className={`nav-link ${isActive('/profile')}`}
                >
                  👤 {user.UserName}
                </a>
              </li>

              <li>
                <button onClick={handleLogout} className="nav-logout">
                  Вихід
                </button>
              </li>
            </>
          )}

          {!user && (
            <>
              <li>
                <a
                  onClick={() => navigate('/login')}
                  className={`nav-link ${isActive('/login')}`}
                >
                  Вхід
                </a>
              </li>

              <li>
                <a
                  onClick={() => navigate('/register')}
                  className={`nav-link ${isActive('/register')}`}
                >
                  Реєстрація
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
