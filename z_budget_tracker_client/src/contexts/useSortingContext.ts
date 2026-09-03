import { useContext } from "react";
import { SortingContext, type SortingContextType } from "./SortingContext";


export function useSortingContext() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return useContext<SortingContextType>(SortingContext as any);
}
