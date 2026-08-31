import { useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { useHasUnsavedChangesStore } from '../state/useHasUnsavedChangesStore';

const NavBar = () => {
  const reproInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [urltoGoTo, setUrlToGoTo] = useState<string>('');
  const location = useLocation();
  const [currentLocation, setCurLoc] = useState(location.pathname);

  const hasUnsavedChanges = useHasUnsavedChangesStore(
    (x) => x.hasUnsavedChanges,
  );

  const setHasUnsavedChanges = useHasUnsavedChangesStore(
    (x) => x.setHasUnsavedChanges,
  );

  function gotoRepro() {
    navigate(`/reprogramming/${reproInputRef.current!.value}`, {
      replace: true,
    });
  }

  function gotoPrev() {
    reproInputRef.current!.value = (
      +reproInputRef.current!.value - 1
    ).toString();

    navigate(`/reprogramming/${reproInputRef.current!.value}`, {
      replace: true,
    });
  }

  function gotoNext() {
    reproInputRef.current!.value = (
      +reproInputRef.current!.value + 1
    ).toString();

    navigate(`/reprogramming/${reproInputRef.current!.value}`, {
      replace: true,
    });
  }
  // const { logout, user } = useAuth();

  // if (!user) return null;

  function handleNavigation(e: React.MouseEvent<HTMLElement>, url: string) {
    e.preventDefault();
    console.log('location.pathname', location.pathname, currentLocation);
    setCurLoc(location.pathname);

    // if (location.pathname === url) {
    //   navigate(currentLocation);
    //   return;
    // }

    if (hasUnsavedChanges) {
      setConfirmModalIsOpen(true);
      setUrlToGoTo(url);
    } else {
      navigate(url);
    }
  }

  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);

  return (
    <div className="flex justify-between align-middle p-3  text-gray-900 dark:text-gray-100 bg-dark-nav ">
      <div className="border p-2">
        {hasUnsavedChanges ? <span>Yes</span> : <span>No</span>}
      </div>
      <div className="flex gap-3 text-2xl p-2 flex-1">
        <NavLink
          to="/login"
          className="nav-link"
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            handleNavigation(e, '/login');
          }}
        >
          Log In
        </NavLink>
        <NavLink
          to="/"
          className="nav-link"
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            handleNavigation(e, '/');
          }}
        >
          Home
        </NavLink>
        <NavLink
          to="/budget"
          className="nav-link"
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            handleNavigation(e, '/budget');
          }}
        >
          Budgets
        </NavLink>
        {/* <NavLink to="/reprogramming" className="nav-link">
          Reprogrammings v1
        </NavLink> */}
        <NavLink
          to="/reprogramming"
          className="nav-link"
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            handleNavigation(e, '/reprogramming');
          }}
        >
          Reprogrammings
        </NavLink>
        <div className="flex text-sm gap-3">
          <input
            type="text"
            ref={reproInputRef}
            defaultValue={179}
            className="border w-20"
          />
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

      <ConfirmModal
        isOpen={confirmModalIsOpen}
        onCancel={() => {
          setTimeout(() => {
            setConfirmModalIsOpen(false);
          }, 500);
          navigate(currentLocation)
        }}
        onConfirm={() => {
          setTimeout(() => {
            setConfirmModalIsOpen(false);
          }, 500);
          setHasUnsavedChanges(false);
          navigate(urltoGoTo);
        }}
        message="Are you sure you wish to leave this page? Any changes made to this reprogramming will be lost. Click OK to continue."
      ></ConfirmModal>
    </div>
  );
};
export default NavBar;
