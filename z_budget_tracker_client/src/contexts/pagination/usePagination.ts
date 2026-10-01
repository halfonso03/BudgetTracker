import { useContext } from "react";
import { PaginationContext } from "./PaginationContext";

export const usePagination = () => {
    const context = useContext(PaginationContext);
    if (context === undefined) {
        throw new Error('usePagination must be used within a MyContextProvider');
    }
    return context;
}