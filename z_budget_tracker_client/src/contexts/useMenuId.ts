import { useContext } from "react";
import { MenuIdContext } from "./MenuIdContext";

function useMenuId() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context = useContext<MenuIdContext>(MenuIdContext as any);
    if (context === undefined)
        throw new Error("MenuIdContext was used outside of MenuIdProvider");
    return context;
}


export default useMenuId;