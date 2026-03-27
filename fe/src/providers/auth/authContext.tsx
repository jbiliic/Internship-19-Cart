import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import client from "../../api/client";

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string, isAdmin: boolean) => void;
  logout: () => void;
}

interface AuthResponse {
  isAdmin: boolean;
  token?: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsLoading(false);
  }, []);

  const login = (token: string, adminStatus: boolean) => {
    localStorage.setItem("accessToken", token);
    setIsLoggedIn(true);
    setIsAdmin(adminStatus);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await client.get<AuthResponse>("/auth/validate");

      if (error) {
        logout();
      } else if (data) {
        setIsLoggedIn(true);
        setIsAdmin(data.isAdmin);
        if (data.token) {
          localStorage.setItem("accessToken", data.token);
        }
      }

      setIsLoading(false);
    };
    initializeAuth();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isAdmin, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
