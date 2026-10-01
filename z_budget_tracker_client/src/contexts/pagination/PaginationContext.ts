import { createContext } from "react";
import type { PaginationContextType } from "./PaginationContextProvider";

export const PaginationContext = createContext<PaginationContextType | undefined>(
    undefined
);
