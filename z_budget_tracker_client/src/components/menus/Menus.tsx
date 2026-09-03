/* eslint-disable @typescript-eslint/no-explicit-any */
import { EllipsisVertical } from 'lucide-react';
import { useContext, useState, type ReactNode } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import useMenuId from '../../contexts/useMenuId';
import { MenusContext } from './MenusContext';

export type MenuContextType = {
  openId: string;
  close: () => void;
  open: (id: string) => void;
};

interface MenuProps {
  options?: string[];
  children: ReactNode;
}

const Menus = ({ children }: MenuProps) => {
  const { setPriorId } = useMenuId();

  const [openId, setOpenId] = useState<string>('');

  const close = () => {
    setPriorId(openId);
    setOpenId('');
  };
  const open = (id: string) => {
    setOpenId(id);
    setPriorId(id);
  };

  return (
    <MenusContext.Provider value={{ openId, close, open }}>
      {children}
    </MenusContext.Provider>
  );
};

interface ListProps {
  id: string;
  children: any;
}

function List({ id, children }: ListProps) {
  const { priorId } = useMenuId();
  const { openId, close } = useContext<MenuContextType>(MenusContext as any);
  const ref = useOutsideClick<HTMLDivElement>(close, false);

  if (priorId !== openId) return null;
  if (openId !== id) return null;

  return (
    <div
      className="absolute animate-repro-fade-in z-1000  translate-x-30 translate-y-5 bg-neutral-50  bg-dark-content border border-gray-300 dark:border-neutral-700 p-2 rounded-sm cursor-pointer "
      ref={ref}
    >
      <ul className="w-50 ">{children}</ul>
    </div>
  );
}

interface TogglerProps {
  id: string;
  children?: ReactNode;
}

function Toggler({ id, children = null }: TogglerProps) {
  const { open, openId, close } = useContext<MenuContextType>(
    MenusContext as any,
  );

  const handleClick = (e: any) => {
    e.stopPropagation();

    if (openId === id) {
      open(id);
    } else if (openId === '' || openId !== id) {
      open(id);
    } else {
      close();
    }
  };

  if (children) {
    return (
      <div className="cursor-pointer" onClick={handleClick}>
        {children}
      </div>
    );
  }

  return (
    <EllipsisVertical
      className="text-gray-500 dark:text-white-50 cursor-pointer text-xl"
      onClick={handleClick}
    ></EllipsisVertical>
  );
}

interface MenuItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function MenuItem({ children, onClick }: MenuItemProps) {
  const { close } = useContext<MenuContextType>(MenusContext as any);

  return (
    <li
      className={`flex justify-start items-center p-1 text-neutral-700 transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md`}
      onClick={() => {
        close();
        onClick?.();
      }}
    >
      {children}
    </li>
  );
}

Menus.List = List;
Menus.Toggler = Toggler;
Menus.MenuItem = MenuItem;

export default Menus;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createContext, useContext, useState, type FC, type ReactNode } from 'react';
// import { createPortal } from 'react-dom';
// import styled from 'styled-components';

// const Menu = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: flex-end;
// `;

// const StyledToggle = styled.button`
//   background: none;
//   border: none;
//   padding: 0.4rem;
//   border-radius: var(--border-radius-sm);
//   transform: translateX(0.8rem);
//   transition: all 0.2s;

//   &:hover {
//     background-color: var(--color-grey-100);
//   }

//   & svg {
//     width: 2.4rem;
//     height: 2.4rem;
//     color: var(--color-grey-700);
//   }
// `;

// const StyledList = styled.ul`
//   position: fixed;

//   background-color: var(--color-grey-0);
//   box-shadow: var(--shadow-md);
//   border-radius: var(--border-radius-md);

//   right: ${(props) => props.position.x}px;
//   top: ${(props) => props.position.y}px;
// `;

// const StyledButton = styled.button`
//   width: 100%;
//   text-align: left;
//   background: none;
//   border: none;
//   padding: 1.2rem 2.4rem;
//   font-size: 1.4rem;
//   transition: all 0.2s;

//   display: flex;
//   align-items: center;
//   gap: 1.6rem;

//   &:hover {
//     background-color: var(--color-grey-50);
//   }

//   & svg {
//     width: 1.6rem;
//     height: 1.6rem;
//     color: var(--color-grey-400);
//     transition: all 0.3s;
//   }
// `;

// type MenuContextType = {
//   openId: string;
//   close: () => void;
//   open: (id: string) => void;
//   position: { x: number; y: number } | null;
//   setPosition: (p: { x: number; y: number }) => void;
// };

// const MenusContext = createContext<MenuContextType | null>(null);

// interface MenuProps {
//   children: ReactNode;
// }

// interface IMenu extends FC<MenuProps> {
//   Menu: FC<any>;
//   Toggle: FC<any>;
//   List: any;
//   Button: any;
// }

// const  Menus: IMenu = ({ children: ReactNode }: MenuProps) => {
//   const [openId, setOpenId] = useState<string>('');
//   const [position, setPosition] = useState<{ x: number; y: number } | null>(
//     null,
//   );

//   const close = () => setOpenId('');
//   const open = setOpenId;

//   return (
//     <MenusContext.Provider
//       value={{ openId, close, open, position, setPosition }}
//     >
//       {children}
//     </MenusContext.Provider>
//   );
// }

// function Toggle({ id: string }) {
//   const { openId, close, open, setPosition } = useContext<MenuContextType>(
//     MenusContext as any,
//   );

//   function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
//     e.stopPropagation();

//     const rect = e.target.closest('button').getBoundingClientRect();

//     console.log(window.innerWidth, rect.x, rect.width);
//     //window.innerWidth - rect.width - rect.x

//     setPosition({
//       x: window.innerWidth - rect.x - rect.width,
//       y: rect.y + rect.height + 8,
//     });

//     openId === '' || openId !== id ? open(id) : close();
//   }

//   return (
//     <StyledToggle onClick={handleClick}>
//       <HiEllipsisVertical />
//     </StyledToggle>
//   );
// }

// function List({ id, children }) {
//   const { openId, position, close } = useContext(MenusContext);
//   const ref = useOutsideClick(close, false);

//   if (openId !== id) return null;

//   return createPortal(
//     <StyledList position={position} ref={ref}>
//       {children}
//     </StyledList>,
//     document.body,
//   );
// }

// function Button({ children, icon, onClick }) {
//   const { close } = useContext(MenusContext);

//   function handleClick() {
//     onClick?.();
//     close();
//   }

//   return (
//     <li>
//       <StyledButton onClick={handleClick}>
//         {icon}
//         <span>{children}</span>
//       </StyledButton>
//     </li>
//   );
// }

// Menus.Menu = Menu;
// Menus.Toggle = Toggle;
// Menus.List = List;
// Menus.Button = Button;

// export default Menus;
