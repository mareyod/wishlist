import React, { useState, useRef } from "react";
import styles from "./RegisterForm.module.css";

import { useAuth } from "../../../hooks/useAuth";
import { useModal } from "../../../hooks/useModal";

const API_URL = import.meta.env.VITE_API_URL;

export default function RegisterForm() {
  const { register } = useAuth();
  const { closeModal, openModal } = useModal();

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    avatar_file: null,
    avatar_url: null,
  });

  const [image, setImage] = useState(null);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Можно загружать только изображения");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert("Файл слишком большой (макс. 8MB)");
      return;
    }

    const url = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      avatar_file: file,
    }));

    setImage((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Введите почту";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
    ) {
      newErrors.email = "Некорректная почта";
    }

    if (!form.nickname.trim()) {
      newErrors.nickname = "Введите никнейм";
    }

    if (!form.password.trim()) {
      newErrors.password = "Введите пароль";
    } else if (form.password.length < 6) {
      newErrors.password = "Минимум 6 символов";
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

      await register(form);

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
        {image || form.avatar_url ? (
          <div className={styles.imageWrapper}>
            <img
              className={styles.img}
              src={image || API_URL + form.avatar_url}
            />

            <button
              type="button"
              className={styles.editBtn}
              onClick={handleClickUpload}
            >
              ✏️
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className={styles.hiddenInput}
                onChange={handleFileChange}
              />
            </button>
          </div>
        ) : (
          <div className={styles.uploadBox} onClick={handleClickUpload}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className={styles.hiddenInput}
              onChange={handleFileChange}
            />

            <div className={styles.uploadInner}>
              <img
                src="/img/avatar.png"
                className={styles.icon}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <input
              type="email"
              name="email"
              placeholder="Почта"
              value={form.email}
              onChange={handleChange}
            />

            {errors.email && (
              <span className={styles.error}>{errors.email}</span>
            )}
          </div>

          <div className={styles.field}>
            <input
              name="nickname"
              placeholder="Никнейм"
              value={form.nickname}
              onChange={handleChange}
            />

            {errors.nickname && (
              <span className={styles.error}>{errors.nickname}</span>
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
              <span className={styles.error}>{errors.password}</span>
            )}
          </div>

          <button
            disabled={loading}
            type="submit"
            className={styles.submitBtn}
          >
            {loading ? "Загрузка..." : "Создать аккаунт"}
          </button>

          {serverError && (
            <div className={styles.serverError}>
              {serverError}
            </div>
          )}
        </form>

        <button
          className={styles.switchBtn}
          onClick={() => openModal("auth.login")}
        >
          Уже есть аккаунт? Войти
        </button>
      </div>
    </div>
  );
}