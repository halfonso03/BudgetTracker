import { createContext, useState, type ReactNode } from 'react';

type MenuIdContext = {
  priorId: string;
  setPriorId: (i: string) => void;
};

interface MenuIdProps {
  children: ReactNode;
}

const MenuIdContext = createContext<MenuIdContext | null>(null);

const MenuIdProvider = ({ children }: MenuIdProps) => {
  const [priorId, setPriorId] = useState<string>('');

  return (
    <div className="relative">
      <MenuIdContext.Provider value={{ priorId, setPriorId }}>
        {children}
      </MenuIdContext.Provider>
    </div>
  );
};

export default MenuIdProvider;

export { MenuIdContext };
