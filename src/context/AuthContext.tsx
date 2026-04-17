import React, { createContext, useState } from "react";
import type { ReactNode, FC } from "react";
import type { LoginResponse } from "../models/auth";

interface AuthContextType {
  user: {
    username: string;
    email: string;
    groups: string[];
  } | null;
  login: (userData: LoginResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // 🔹 Restaurar usuario (SIN tokens)
  const [user, setUser] = useState<AuthContextType["user"]>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData: LoginResponse) => {
    // 1) Guardar tokens (para httpClient)
    localStorage.setItem("access", userData.access);
    localStorage.setItem("refresh", userData.refresh);

    // 2) Guardar SOLO info del usuario (para UI)
    const userInfo = {
      username: userData.username,
      email: userData.email,
      groups: userData.groups,
    };

    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const logout = () => {
    // 🔥 Limpiar TODO
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
