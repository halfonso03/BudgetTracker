import { createContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  // user: string | null;
  user: User | null;
  loginId: string | null;
  login: (user: User) => void;
  logout: () => void;
  // login: (accessToken: string, userData: string, userId: number) => void;
  // isLoggedIn: () => boolean;
}

interface AuthProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginId, setloginId] = useState<string | null>(null);

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

  const login = (user: User) => {
    setUser(user);
    setloginId(user.email.substring(0, user.email.indexOf('@')));
  };

  const logout = () => {
    setUser(null);
    setloginId(null);

    // TODO:  Call backend endpoint here to clear HTTP-Only refresh cookies

  };

  // const isLoggedIn = () => {
  //   if (localStorage.getItem('token')) {
  //     const token = localStorage.getItem('token') as string;

  //     const decodedToken = jwtDecode(token);
  //     const currentTime = Date.now() / 1000;

  //     // Check if token is expired
  //     if (decodedToken.exp! < currentTime) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  return (
    <AuthContext.Provider value={{ user, loginId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

export { type AuthContextType };
