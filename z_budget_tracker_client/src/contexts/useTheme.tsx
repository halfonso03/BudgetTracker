import { useContext } from "react";
import { ThemeContext, type ThemeContextType } from "./ThemeContext";

function useTheme() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context = useContext<ThemeContextType>(ThemeContext as any);
    if (context === undefined)
        throw new Error("ThemeContext was used outside of MenuIdProvider");
    return context;
}


export default useTheme;