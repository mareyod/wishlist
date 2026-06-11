import { ModalRenderer } from "./ModalRenderer";
import { createContext, useState, useCallback,  type ReactNode } from "react";

import type { ModalName, ModalState, ModalContextValue, OpenModal } from "../../types/modal.types";

export const ModalContext = createContext<ModalContextValue | null>(null);

interface ModalProviderProps {
  children: ReactNode;
}


export function ModalProvider({ children }: ModalProviderProps) {

  const [modal, setModal] = useState<ModalState | null>(null);

  const openModal = useCallback<OpenModal>(
    (name: ModalName, props?: ModalState['props']): void  => {
      setModal({ name, props } as ModalState);
  },[])

  const closeModal = useCallback((): void => setModal(null), []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <ModalRenderer modal={modal} onClose={closeModal} />
    </ModalContext.Provider>
  );
}