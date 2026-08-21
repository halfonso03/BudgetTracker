import { useContext } from "react";
import { ReproContext, type ReproContextType } from "./ReproContext";

function useRepro() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context = useContext<ReproContextType>(ReproContext as any);
    if (context === undefined)
        throw new Error("ReproContext was used outside of ReproProvider");
    return context;
}


export default useRepro;