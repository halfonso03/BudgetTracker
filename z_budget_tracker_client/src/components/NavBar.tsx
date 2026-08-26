import { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NavBar = () => {
  const reproInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  function gotoRepro() {
    console.log(
      '`/reprogramming/${reproInputRef.current!.value}`',
      `/reprogramming/${reproInputRef.current!.value}`,
    );
    navigate(`/reprogramming/${reproInputRef.current!.value}`, {
      replace: true,
    });
  }

  function gotoPrev() {
    console.log(
      '`/reprogramming/${reproInputRef.current!.value}`',
      `/reprogramming/${reproInputRef.current!.value}`,
    );
    reproInputRef.current!.value = (
      +reproInputRef.current!.value - 1
    ).toString();

    navigate(`/reprogramming/${reproInputRef.current!.value}`, {
      replace: true,
    });
  }

  function gotoNext() {
    console.log(
      '`/reprogramming/${reproInputRef.current!.value}`',
      `/reprogramming/${reproInputRef.current!.value}`,
    );

    reproInputRef.current!.value = (
      +reproInputRef.current!.value + 1
    ).toString();

    navigate(`/reprogramming/${reproInputRef.current!.value}`, {
      replace: true,
    });
  }
  // const { logout, user } = useAuth();

  // if (!user) return null;

  return (
    <div className="flex justify-between align-middle p-3  text-gray-900 dark:text-gray-100 bg-dark-nav ">
      <div className="flex gap-3 text-2xl p-2 flex-1">
        <NavLink to="/login" className="nav-link">
          Log In
        </NavLink>
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/budget" className="nav-link">
          Budgets
        </NavLink>
        {/* <NavLink to="/reprogramming" className="nav-link">
          Reprogrammings v1
        </NavLink> */}
        <NavLink to="/reprogramming" className="nav-link">
          Reprogrammings
        </NavLink>
        <div className="flex text-sm gap-3">
          <input type="text" ref={reproInputRef} className="border w-20" />
          <Button buttonSize="xsmall" onClick={gotoRepro}>
            Go to Repro
          </Button>

          <Button buttonSize="xsmall" onClick={gotoPrev}>
            <ChevronLeft></ChevronLeft>
          </Button>
          <Button buttonSize="xsmall" onClick={gotoNext}>
            <ChevronRight></ChevronRight>
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center w-full flex-0 mr-2">
        {/* <AccountToggler loginId={user} logOut={logout}></AccountToggler> */}
      </div>
    </div>
  );
};
export default NavBar;
