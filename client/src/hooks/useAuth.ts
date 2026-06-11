import { useContext } from "react";
import { AuthContext } from "../providers/auth/AuthProvider";
import type { AuthContextValue } from "../types/auth-context.types";

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth должен использоваться внутри AuthProvider");
    }

    return context;
};