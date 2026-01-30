"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthUser } from "@/types/auth.types";
import { authService } from "@/services/auth.service";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  /* ------------------ VERIFY AUTH VIA /auth/me ------------------ */
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const me = await authService.me();
        console.log("Authenticated user:", me);
        setUser(me);
      } catch {
        // access token invalid / expired
        setUser(null);
      } finally {
        setIsHydrated(true);
      }
    };

    verifyUser();
  }, []);

  /* ------------------ LOGOUT ------------------ */
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  /* ------------------ PREVENT UI FLICKER ------------------ */
  if (!isHydrated) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ------------------ CUSTOM HOOK ------------------ */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
