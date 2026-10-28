import { NavLink, Outlet } from 'react-router-dom';
import MenuIdProvider from '../../contexts/MenuIdContext';
import styled from 'styled-components';

const StyledMenu = styled.div`
  flex: 1;
  background-color: var(--color-neutral-200);
  min-height: 80vh;
  padding: 1rem;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  &:link,
  &:visited {
    align-items: center;
    gap: 0.7rem;
    font-weight: 500;
    padding: 1rem 0.1rem;
    transition: all 0.3s;
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

const Administration = () => {
  return (
    <MenuIdProvider>
      <div className="grid grid-cols-[1.5fr_14fr] gap-4 ">
        <StyledMenu className="flex-col ">
          <div className="admin-menu-item">
            <StyledNavLink
              to="users"
              className={({ isActive }) =>
                isActive ? 'admin-menu-item-active' : ''
              }
            >
              <div>Users</div>
            </StyledNavLink>
          </div>
          <div className="admin-menu-item">
            <StyledNavLink
              to="initiatives"
              className={({ isActive }) =>
                isActive ? 'admin-menu-item-active' : ''
              }
            >
              <div>Initiatives</div>
            </StyledNavLink>
          </div>
          <div className="admin-menu-item">
            <StyledNavLink
              to="awards"
              className={({ isActive }) =>
                isActive ? 'admin-menu-item-active' : ''
              }
            >
              <div>Awards</div>
            </StyledNavLink>
          </div>
        </StyledMenu>

        <div>
          <Outlet></Outlet>
        </div>
      </div>
    </MenuIdProvider>
  );
};
export default Administration;
