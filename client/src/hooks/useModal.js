import { useContext } from "react";
import { ModalContext } from "../providers/modal/ModalProvider";

export const useModal = () => useContext(ModalContext);