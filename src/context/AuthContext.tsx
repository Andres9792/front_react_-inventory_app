import React, { createContext, useState,  } from "react";
import type { ReactNode, FC } from "react";
import type { LoginResponse } from "../models/auth";

interface AuthContextType {
  user: LoginResponse | null;
  login: (userData: LoginResponse) => void;
  logout: () => void;
}

// 🔹 Creamos el contexto (valor inicial undefined)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔹 Definimos el proveedor
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const login = (userData: LoginResponse) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // 👇 ESTA ES LA LÍNEA QUE FALTABA
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

