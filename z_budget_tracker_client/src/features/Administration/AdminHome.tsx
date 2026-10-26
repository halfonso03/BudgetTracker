import { NavLink } from "react-router-dom";

const AdminHome = () => {
  return (
    <div>
      <NavLink
        to="/admin/users"
        className="nav-link"
        // onClick={(e: React.MouseEvent<HTMLElement>) => {
        //   handleReproNavigation(e, '/reports');
        // }}
      >
        Admin
      </NavLink>
      <NavLink
        to="/admin/initiatives"
        className="nav-link"
        // onClick={(e: React.MouseEvent<HTMLElement>) => {
        //   handleReproNavigation(e, '/reports');
        // }}
      >
        Admin
      </NavLink>
    </div>
  );
};
export default AdminHome;
