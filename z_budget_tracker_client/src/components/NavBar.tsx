import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import ConfirmModal from './ConfirmModal';
import { useHasUnsavedChangesStore } from '../state/useHasUnsavedChangesStore';
import useAccount from '../api/hooks/auth/useAuth';
import axios from 'axios';
import useAuth from '../contexts/useAuth';

const NavBar = () => {
  const navigate = useNavigate();
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [urltoGoTo, setUrlToGoTo] = useState<string>('');
  const [loggedOut, setLoggedout] = useState(false);

  const location = useLocation();

  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const reproInputRef = useRef<HTMLInputElement | null>(null);
  const hasUnsavedChanges = useHasUnsavedChangesStore(
    (x) => x.hasUnsavedChanges,
  );
  const setHasUnsavedChanges = useHasUnsavedChangesStore(
    (x) => x.setHasUnsavedChanges,
  );

  const { user: user, login } = useAuth();
  const { logoutUser } = useAccount();
  // if (!user) {
  //   reLogin();
  // }

  useEffect(() => {
    // Check if browser cookie is still valid on page reload
    if (user) return;

    axios
      .get('https://localhost:5001/api/account/user-info', {
        withCredentials: true,
      })
      .then((response) => {
        // .MapIdentityApi returns user info (like email) if the cookie is valid

        login(response.data);
        console.log('location', location.pathname);
        console.log('user', user);
        navigate(location.pathname);
      })
      .catch((error) => {
        // 401 Unauthorized means no cookie or expired cookie
        console.log('error', error);
        // setUser(null);
      })
      .finally(() => {
        // setLoading(false); // Stop showing a blank/loading screen
      });
  }, [location.pathname, login, navigate, user]);

  // function gotoRepro() {
  //   navigate(`/reprogramming/${reproInputRef.current!.value}`, {
  //     replace: true,
  //   });
  // }

  // function gotoPrev() {
  //   reproInputRef.current!.value = (
  //     +reproInputRef.current!.value - 1
  //   ).toString();

  //   navigate(`/reprogramming/${reproInputRef.current!.value}`, {
  //     replace: true,
  //   });
  // }

  // function gotoNext() {
  //   reproInputRef.current!.value = (
  //     +reproInputRef.current!.value + 1
  //   ).toString();

  //   navigate(`/reprogramming/${reproInputRef.current!.value}`, {
  //     replace: true,
  //   });
  // }
  // const { logout, user } = useAuth();
  // if (!user) return null;

  function handleNavigation(e: React.MouseEvent<HTMLElement>, url: string) {
    e.preventDefault();
    navigate(url);
    return;

    const path = location.pathname;
    const basePath =
      path.indexOf('/', 1) > -1
        ? path.substring(0, path.indexOf('/', 1))
        : path;
    if (basePath !== url) {
      if (hasUnsavedChanges) {
        setConfirmModalIsOpen(true);
        setUrlToGoTo(url);
      } else {
        navigate(url);
      }
    } else {
      navigate(url);
    }
  }

  function handleBudgetNavigation(
    e: React.MouseEvent<HTMLElement>,
    url: string,
  ) {
    e.preventDefault();
    navigate(url);
    return;
    if (hasUnsavedChanges) {
      setConfirmModalIsOpen(true);
      setUrlToGoTo(url);
    } else {
      navigate(url);
    }
  }

  function handleReproNavigation(
    e: React.MouseEvent<HTMLElement>,
    url: string,
  ) {
    e.preventDefault();
    navigate(url);
    return;

    const path = location.pathname;

    const basePath =
      path.indexOf('/', 1) > -1
        ? path.substring(0, path.indexOf('/', 1))
        : path;

    if (location.pathname !== '/reprogramming/search') {
      if (basePath !== url) {
        if (hasUnsavedChanges) {
          setConfirmModalIsOpen(true);
          setUrlToGoTo(url);
        } else {
          navigate(url);
        }
      }
    } else {
      navigate(url);
    }
  }
  {
    /* <div className="flex absolute bottom-0 left-0">
        {user && <pre>{JSON.stringify(user)}</pre>}
        <div className="border p-2">
          {hasUnsavedChanges ? <span>Yes</span> : <span>No</span>}
        </div>
      </div> */
  }
  {
    /* <pre>{JSON.stringify(user)}</pre> */
  }
  {
    /* <div className="flex text-sm gap-3">
          <input
            type="text"
            ref={reproInputRef}
            defaultValue={1}
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
        </div> */
  }
  return (
    <div>
      {user && (
        //bg-dark-nav
        <div className="bg-white border-b border-b-neutral-300 flex justify-between align-middle p-3 text-gray-900 dark:text-gray-100  ">
          <div className="flex p-2 text-xl pb-0 justify-between w-full">
            <div className="flex gap-5 ">
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
                  handleBudgetNavigation(e, '/budget');
                }}
              >
                Budgets
              </NavLink>
              <NavLink
                to="/reprogramming"
                className="nav-link"
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  handleReproNavigation(e, '/reprogramming');
                }}
              >
                Reprogrammings
              </NavLink>
              <NavLink
                to="/payees"
                className="nav-link"
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  handleReproNavigation(e, '/payees');
                }}
              >
                Payees
              </NavLink>
              <NavLink
                to="/reports"
                className="nav-link"
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  handleReproNavigation(e, '/reports');
                }}
              >
                Reports
              </NavLink>
              <NavLink to="/proto" className="nav-link">
                Proto
              </NavLink>
            </div>
            <Button
              key={loggedOut.toString()}
              className="nav-link cursor-pointer self-end"
              onClick={() => {
                logoutUser();
                setLoggedout((prev) => !prev);
              }}
            >
              Log Out
            </Button>
          </div>
          <ConfirmModal
            isOpen={confirmModalIsOpen}
            onCancel={() => {
              setTimeout(() => {
                setConfirmModalIsOpen(false);
              }, 500);
              // navigate(currentLocation);
            }}
            onConfirm={() => {
              setTimeout(() => {
                setConfirmModalIsOpen(false);
              }, 500);
              setHasUnsavedChanges(false);
              navigate(urltoGoTo);
            }}
            message="Are you sure you wish to leave this page? Any changes made to this entry will be lost. Click OK to continue."
          ></ConfirmModal>
        </div>
      )}
    </div>
  );
};
export default NavBar;
