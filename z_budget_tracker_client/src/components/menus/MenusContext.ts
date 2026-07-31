import { createContext } from "react";
import type { MenuContextType } from "./Menus";

export const MenusContext = createContext<MenuContextType | null>(null);
