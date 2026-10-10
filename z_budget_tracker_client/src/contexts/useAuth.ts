import { useContext } from "react";
import { ClientAuthContext, type ClientAuthContextType } from "./ClientAuthContext";

function useClientAuth() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context = useContext<ClientAuthContextType>(ClientAuthContext as any);
    if (context === undefined)
        throw new Error("MenuIdContext was used outside of MenuIdProvider");
    return context;
}


export default useClientAuth;