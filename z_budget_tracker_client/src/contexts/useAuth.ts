import { useContext } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";

function useAuth() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context = useContext<AuthContextType>(AuthContext as any);
    if (context === undefined)
        throw new Error("MenuIdContext was used outside of MenuIdProvider");
    return context;
}


export default useAuth;