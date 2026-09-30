import { createContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  loginId: string | null;
  login: (user: User) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

interface AuthProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginId, setloginId] = useState<string | null>(null);

  const login = (user: User) => {
    setUser(user);
    setloginId(user.email.substring(0, user.email.indexOf('@')));
  };

  const logout = () => {
    setUser(null);
    setloginId(null);
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loginId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

export { type AuthContextType };
