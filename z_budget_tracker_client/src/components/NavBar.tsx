import { Link } from 'react-router-dom';

const NavBar = () => {
  // const { logout, user } = useAuth();

  // if (!user) return null;

  return (
    <div className="flex justify-between align-middle p-3 border-b border-b-gray-300 dark:border-b-neutral-700 text-gray-900 dark:text-gray-100 bg-dark-nav ">
      <div className="flex gap-3 text-2xl p-2 flex-1">
        <Link to="/">Home</Link>
        <Link to="/budget">Budgets</Link>
        <Link to="/reprogramming">Reprogrammings</Link>
      </div>
      <div className="flex justify-center items-center w-full flex-0 mr-2">
        {/* <AccountToggler loginId={user} logOut={logout}></AccountToggler> */}
      </div>
    </div>
  );
};
export default NavBar;
