import { NavLink, Outlet } from 'react-router-dom';
import MenuIdProvider from '../../contexts/MenuIdContext';
import Label from '../../components/Label';
import SortingProvider from '../../contexts/SortingContextProvider';

type MenuItem = {
  id: number;
  name: string;
  path: string;
};

// const StyledMenu = styled.div`
//   flex: 1;
//   background-color: var(--color-neutral-200);
//   &.dark.background-color: var(--color-neutral-200);
//   min-height: 80vh;
//   padding: 1rem;
// `;

// const StyledNavLink = styled(NavLink)`
//   display: flex;
//   &:link,
//   &:visited {
//     align-items: center;
//     gap: 0.7rem;
//     font-weight: 500;
//     padding: 1rem 0.1rem;
//     transition: all 0.3s;
//   }

//   & svg {
//     width: 1.6rem;
//     height: 1.6rem;
//     transition: all 0.3s;
//   }

//   &:hover svg,
//   &:active svg,
//   &.active:link svg,
//   &.active:visited svg {
//     color: var(--color-brand-600);
//   }
// `;

const menuItems: MenuItem[] = [
  { id: 1, name: 'Users', path: 'users' },
  { id: 2, name: 'Initiatives', path: 'initiatives' },
  { id: 3, name: 'Grants', path: 'grants' },
];

const Administration = () => {
  return (
    <MenuIdProvider>
      <SortingProvider defaultSortOrder={'ID'} >
        <div className="grid grid-cols-[1.5fr_14fr] gap-4 ">
          <div className="flex flex-col gap-4 bg-neutral-200/60 dark:bg-slate-800/70 py-4 px-4 rounded-md min-h-[80dvh] ">
            {menuItems.map((item) => (
              <div className="  hover:bg-neutral-200 dark:hover:bg-slate-700 py-4 px-2 rounded-md transition-all">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    (isActive ? 'bg-neutral-200 dark:bg-slate-800 ' : '' + '')
                  }
                >
                  <Label>{item.name}</Label>
                </NavLink>
              </div>
            ))}
          </div>

          <div>
            <Outlet></Outlet>
          </div>
        </div>
      </SortingProvider>
    </MenuIdProvider>
  );
};
export default Administration;
