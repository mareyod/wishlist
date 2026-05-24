import { ModalRenderer } from "./ModalRenderer";
import { createContext, useState } from "react";

export const ModalContext = createContext(null);

export function ModalProvider({ children }) {

  const [modal, setModal] = useState(null);

  const openModal = (name, props) => setModal({ name, props });
  const closeModal = () => setModal(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <ModalRenderer modal={modal} onClose={closeModal} />
    </ModalContext.Provider>
  );
}