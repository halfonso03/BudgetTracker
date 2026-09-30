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
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const reproInputRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();
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
    console.log('123', 123);
    axios
      .get('https://localhost:5001/api/account/user-info', {
        withCredentials: true,
      })
      .then((response) => {
        // .MapIdentityApi returns user info (like email) if the cookie is valid
        login(response.data);

        console.log('navbar useEffect success');
        // setUser(response.data);
      })
      .catch((error) => {
        // 401 Unauthorized means no cookie or expired cookie
        console.log('error', error);
        // setUser(null);
      })
      .finally(() => {
        // setLoading(false); // Stop showing a blank/loading screen
      });
  }, [login]);

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

  return (
    <div>
      {/* <div className="flex absolute bottom-0 left-0">
        {user && <pre>{JSON.stringify(user)}</pre>}
        <div className="border p-2">
          {hasUnsavedChanges ? <span>Yes</span> : <span>No</span>}
        </div>
      </div> */}
      <div>
        {user ? <h1>Welcome back, {user.email}!</h1> : <h1>Please Log In</h1>}
      </div>
      <pre>{JSON.stringify(user)}</pre>

      <div className="flex justify-between align-middle p-3 text-gray-900 dark:text-gray-100 bg-dark-nav ">
        <div className="flex gap-3 text-xl p-2 flex-1">
          {/* <Link
            to="/login"
            className="nav-link"
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              handleNavigation(e, '/login');
            }}
          >
            Log In
          </Link> */}
          {/* {!user && (
     
          )} */}
          {user && (
            <div className="flex justify-between w-full">
              <div className="flex gap-2">
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
                  to="/reports"
                  className="nav-link"
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    handleReproNavigation(e, '/reports');
                  }}
                >
                  Reports
                </NavLink>
                <NavLink
                  to="/vendors"
                  className="nav-link"
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    handleReproNavigation(e, '/vendors');
                  }}
                >
                  Vendors
                </NavLink>
                <NavLink
                  to="/contractors"
                  className="nav-link"
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    handleReproNavigation(e, '/contractors');
                  }}
                >
                  Contractors
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
          )}

          {/* <div className="flex text-sm gap-3">
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
        </div> */}
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
    </div>
  );
};
export default NavBar;
