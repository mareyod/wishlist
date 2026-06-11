import { useContext } from "react";
import { ModalContext } from "../providers/modal/ModalProvider";
import type { ModalContextValue } from "../types/modal.types";

export const useModal = (): ModalContextValue => {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error("useModal должен использоваться внутри ModalProvider");
    }

    return context;
};