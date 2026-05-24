
import React, { useState } from "react";
import styles from "./LoginForm.module.css";

import { useAuth } from "../../../hooks/useAuth";
import { useModal } from "../../../hooks/useModal";

export default function LoginForm() {
  const { login } = useAuth();
  const { closeModal, openModal } = useModal();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Введите почту";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
    ) {
      newErrors.email = "Некорректная почта";
    }

    if (!form.password.trim()) {
      newErrors.password = "Введите пароль";
    } else if (form.password.length < 5) {
      newErrors.password = "Минимум 5 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await login(form);

      closeModal(); 
    } catch (e) {
      setServerError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.background} onClick={closeModal}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h1>Вход</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <input
              type="email"
              name="email"
              placeholder="Почта"
              value={form.email}
              onChange={handleChange}
            />

            {errors.email && (
              <span className={styles.error}>
                {errors.email}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={form.password}
              onChange={handleChange}
            />

            {errors.password && (
              <span className={styles.error}>
                {errors.password}
              </span>
            )}
          </div>

          <button
            disabled={loading}
            type="submit"
            className={styles.submitBtn}
          >
            {loading ? "Загрузка..." : "Войти"}
          </button>

          {serverError && (
            <div className={styles.serverError}>
              {serverError}
            </div>
          )}
        </form>

        <button
          className={styles.switchBtn}
          onClick={() => openModal("auth.register")}
        >
          Нет аккаунта? Регистрация
        </button>
      </div>
    </div>
  );
}