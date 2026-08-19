import { NavLink } from 'react-router-dom';

const NavBar = () => {
  // const { logout, user } = useAuth();

  // if (!user) return null;

  return (
    <div className="flex justify-between align-middle p-3  text-gray-900 dark:text-gray-100 bg-dark-nav ">
      <div className="flex gap-3 text-2xl p-2 flex-1">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/budget" className="nav-link">
          Budgets
        </NavLink>
           <NavLink to="/reprogramming1" className="nav-link">
          Reprogrammings v1
        </NavLink>
        <NavLink to="/reprogramming2" className="nav-link">
          Reprogrammings v2
        </NavLink>
      </div>
      <div className="flex justify-center items-center w-full flex-0 mr-2">
        {/* <AccountToggler loginId={user} logOut={logout}></AccountToggler> */}
      </div>
    </div>
  );
};
export default NavBar;
