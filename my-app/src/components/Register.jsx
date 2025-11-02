import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import "./AuthForm.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await authAPI.register(name, email, password, role);
      setMessage("Реєстрація успішна! Перенаправляємо на сторінку входу...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(`Помилка при реєстрації: ${err.message || "невідома помилка"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container-wrapper">
      <div className="auth-container">
        <h2>Реєстрація в HarvestMood</h2>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Ім'я користувача</label>
            <input
              type="text"
              placeholder="Введіть ваше ім'я"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Електронна пошта</label>
            <input
              type="email"
              placeholder="Введіть вашу електронну пошту"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="Створіть надійний пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <div className="role-selection">
              <label>Оберіть вашу роль:</label>
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
            >
              <option value="Customer">Покупець</option>
              <option value="Farmer">Фермер</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Реєстрація..." : "Зареєструватись"}
          </button>
        </form>

        {message && (
          <p className={`message ${message.includes("успішна") ? "" : "error"}`}>
            {message}
          </p>
        )}

        <div className="auth-switch">
          <button
            type="button"
            onClick={() => navigate('/login')}
            disabled={isLoading}
          >
            Увійти
          </button>
        </div>

        <div className="additional-info">
          <p><strong>Фермер:</strong> Може додавати товари та керувати ними</p>
          <p><strong>Покупець:</strong> Може купувати товари та переглядати історію замовлень</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
