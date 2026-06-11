import styles from "./Header.module.css";
import { Link } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";
import { useModal } from "../../../hooks/useModal";
import { FriendsIcon } from "../../ui/FriendsIcon";
import { HomeIcon } from "../../ui/HomeIcon";

export default function Header() {

  const { user, logout } = useAuth();
  const { openModal } = useModal();


  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/">
          <img className={styles.logo} src="/img/logo.png"/>
        </Link>
      </div>

      <div className={styles.actions}>
        {!user ? (
          <>
            <button
              className={styles.authButton}
              onClick={() => openModal("auth.login")}
            >
              Войти
            </button>

            <button
              className={styles.authButton}
              onClick={() => openModal("auth.register")}
            >
              Создать аккаунт
            </button>
          </>
        ) : (
          <>
              <Link
                to="/friends"
                className={styles.iconButton}
              >
                <FriendsIcon/>
              </Link>

              <Link
                to={`/users/${user.nickname}`}
                className={styles.iconButton}
              >
                <HomeIcon/>
              </Link>

            <button
              className={styles.authButton}
              onClick={logout}
            >
              Выйти
            </button>
          </>
        )}
      </div>
    </header>
  );
}