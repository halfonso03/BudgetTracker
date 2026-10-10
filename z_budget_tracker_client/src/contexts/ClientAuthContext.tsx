import { createContext, useState, type ReactNode } from 'react';

interface ClientAuthContextType {
  user: User | null;
  loginId: string | null;
  login: (user: User) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

interface AuthProps {
  children: ReactNode;
}

const ClientAuthContext = createContext<ClientAuthContextType | null>(null);

export const ClientAuthProvider = ({ children }: AuthProps) => {
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
    <ClientAuthContext.Provider
      value={{ isLoggedIn, user, loginId, login, logout }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
};

export { ClientAuthContext };

export { type ClientAuthContextType };
