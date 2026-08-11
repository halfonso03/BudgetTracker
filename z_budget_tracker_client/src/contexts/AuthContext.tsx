import { jwtDecode } from 'jwt-decode';
import { createContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  // token: string | null;
  // user: string | null;
  userId: number | null;
  login: (userId: number) => void;
  // login: (accessToken: string, userData: string, userId: number) => void;

  logout: () => void;
  isLoggedIn: () => boolean;
}

interface AuthProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProps) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  // const [token, setToken] = useState<string | null>(() => {
  //   const i = localStorage.getItem('token');
  //   if (i) return i;
  //   return null;
  // });

  // const [user, setUser] = useState<string | null>(() => {
  //   const i = localStorage.getItem('user');
  //   if (i) return i;
  //   return null;
  // });

  const login = (userId: number) => {
    setUserId(userId);
    // setToken(token);
    // setUser(userData);
    // localStorage.setItem('token', token);
    // localStorage.setItem('user', userData);
  };

  const logout = () => {
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    // setToken(null);
    // setUser(null);
    navigate('/login');
    // Call backend endpoint here to clear HTTP-Only refresh cookies
  };

  const isLoggedIn = () => {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token') as string;

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (decodedToken.exp! < currentTime) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

export { type AuthContextType };
