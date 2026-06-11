import WishFormModal from "../../components/modals/WishFormModal/WishFormModal";
import WishDetailsModal from "../../components/modals/WishDetailsModal/WishDetailsModal";
import LoginForm from "../../components/modals/LoginForm/LoginForm";
import RegisterForm from "../../components/modals/RegisterForm/RegisterForm";
import ConfirmModal from "../../components/modals/ConfirmModal/ConfirmModal";

import type { ModalState } from "../../types/modal.types";

interface ModalRendererProps {
  modal: ModalState | null;
  onClose: () => void;
}

export function ModalRenderer({ modal, onClose }: ModalRendererProps) {
  if (!modal) return null;

  switch (modal.name) {
    case "wish.create":
    case "wish.edit":
      return (
        <WishFormModal
          wish={modal.props.wish}
          groups={modal.props.groups}
          onSave={modal.props.onSave}
          onClose={onClose}
        />
      );

    case "wish.details":
      return (
        <WishDetailsModal
          wish={modal.props.wish}
          onClose={onClose}
        />
      );

    case "auth.login":
      return <LoginForm />;

    case "auth.register":
      return <RegisterForm />;

    case "confirm":
      return (
        <ConfirmModal
          onConfirm={modal.props.onConfirm}
          onCancel={modal.props.onCancel}
        />
      );

    default:
      return null;
  }
}