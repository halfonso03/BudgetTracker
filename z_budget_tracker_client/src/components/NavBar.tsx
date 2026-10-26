import { useCallback, useState } from 'react';
import {
  NavLink,
  useBlocker,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import { useHasUnsavedChangesStore } from '../state/useHasUnsavedChangesStore';
import useClientAuth from '../contexts/useClientAuth';

const NavBar = () => {
  const navigate = useNavigate();
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [urltoGoTo, setUrlToGoTo] = useState<string>('');

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

  const { user: user, isLoggedIn } = useClientAuth();
  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname,
      [hasUnsavedChanges],
    ),
  );

  // if (!user) {
  //   reLogin();
  // }

  // useEffect(() => {
  //   // Check if browser cookie is still valid on page reload
  //   if (user) return;

  //   axios
  //     .get('https://localhost:5001/api/account/user-info', {
  //       withCredentials: true,
  //     })
  //     .then((response) => {
  //       // .MapIdentityApi returns user info (like email) if the cookie is valid

  //       login(response.data);
  //       console.log('location', location.pathname);
  //       console.log('user', user);
  //       navigate(location.pathname);
  //     })
  //     .catch((error) => {
  //       // 401 Unauthorized means no cookie or expired cookie
  //       console.log('error', error);
  //       // setUser(null);
  //     })
  //     .finally(() => {
  //       // setLoading(false); // Stop showing a blank/loading screen
  //     });
  // }, [location.pathname, login, navigate, user]);

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

  return (
    <div>
      {user && (
        //bg-dark-nav
        <div className="bg-white border-b border-b-neutral-300 flex justify-between align-middle p-3 text-gray-900 dark:text-gray-100  ">
          <div className="flex p-2 text-xl pb-0 justify-between w-full">
            <div className="flex absolute bottom-0 left-0">
              <div className="border p-2">
                {hasUnsavedChanges ? <span>Yes</span> : <span>No</span>}
              </div>
            </div>
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
              <NavLink to="/budget" className="nav-link">
                Budgets
              </NavLink>

              <NavLink to="/reprogramming" className="nav-link">
                Reprogrammings
              </NavLink>
              <NavLink
                to="/payments"
                className="nav-link"
                // onClick={(e: React.MouseEvent<HTMLElement>) => {
                //   handleReproNavigation(e, '/payments');
                // }}
              >
                Payments
              </NavLink>
              <NavLink
                to="/payees"
                className="nav-link"
                // onClick={(e: React.MouseEvent<HTMLElement>) => {
                //   handleReproNavigation(e, '/payees');
                // }}
              >
                Payees
              </NavLink>

              <NavLink
                to="/reports"
                className="nav-link"
                // onClick={(e: React.MouseEvent<HTMLElement>) => {
                //   handleReproNavigation(e, '/reports');
                // }}
              >
                Reports
              </NavLink>
              {user.roles!.some((x) => x === 'ADMIN') && (
                <>
                  <NavLink
                    to="/admin"
                    className="nav-link"
                    // onClick={(e: React.MouseEvent<HTMLElement>) => {
                    //   handleReproNavigation(e, '/reports');
                    // }}
                  >
                    Admin
                  </NavLink>
                 
                </>
              )}

              {blocker.state === 'blocked' && hasUnsavedChanges && (
                <div>
                  <ConfirmModal
                    isOpen={true}
                    onCancel={() => {
                      setTimeout(() => {
                        setConfirmModalIsOpen(false);
                        blocker.reset();
                      }, 500);
                      // navigate(currentLocation);
                    }}
                    onConfirm={() => {
                      // setTimeout(() => {
                      //   setConfirmModalIsOpen(false);
                      // }, 500);
                      blocker.proceed();
                      setHasUnsavedChanges(false);
                      // navigate(urltoGoTo);
                    }}
                    message="NEW You have unsaved changes! Are you sure you want to leave? Any changes made to this entry will be lost. Click OK to continue."
                  ></ConfirmModal>
                </div>
              )}
            </div>
            <div>
              {isLoggedIn() && <span>Hello, {user.firstName}</span>}{' '}
              {isLoggedIn() && (
                <NavLink to="/logout" className="nav-link">
                  Log Out
                </NavLink>
              )}
            </div>
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
            message="1 Are you sure you wish to leave this page? Any changes made to this entry will be lost. Click OK to continue."
          ></ConfirmModal>
        </div>
      )}
    </div>
  );
};
export default NavBar;
