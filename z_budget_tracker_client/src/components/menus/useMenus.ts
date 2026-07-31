import type { MenuContextType } from './Menus';
import { MenusContext } from './MenusContext';
import { useContext } from "react";


function useMenuId() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context = useContext<MenuContextType>(MenusContext as any);
    if (context === undefined)
        throw new Error("MenuIdContext was used outside of MenuIdProvider");
    return context;
}


export default useMenuId;