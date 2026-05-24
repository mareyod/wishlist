import WishFormModal from "../../components/modals/WishFormModal/WishFormModal";
import WishDetailsModal from "../../components/modals/WishDetailsModal/WishDetailsModal";
import LoginForm from "../../components/modals/LoginForm/LoginForm";
import RegisterForm from "../../components/modals/RegisterForm/RegisterForm";
import ConfirmModal from "../../components/modals/ConfirmModal/ConfirmModal";

const MODALS = {
  "wish.create": WishFormModal,
  "wish.edit": WishFormModal,
  "wish.details": WishDetailsModal,
  "auth.login": LoginForm,
  "auth.register": RegisterForm,
  "confirm": ConfirmModal
};

export function ModalRenderer({ modal, onClose }) {
  if (!modal) return null;

  const Component = MODALS[modal.name];

  if (!Component) return null;

  return <Component {...modal.props} onClose={onClose} />;
}