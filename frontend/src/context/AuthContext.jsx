import React, { createContext, useState, useEffect, useContext } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  getCurrentUser,
} from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // INIT AUTH (restore session)
  // ===============================
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Option A: trust backend (recommended)
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // keep sync
        localStorage.setItem("user", JSON.stringify(currentUser));
      } catch (error) {
        // token invalid → clear everything
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ===============================
  // LOGIN
  // ===============================
  const login = async (email, password) => {
    const data = await apiLogin({ email, password });

    // expected: { token, user }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);

    return data;
  };

  // ===============================
  // REGISTER
  // ===============================
  const register = async (username, email, password) => {
    const data = await apiRegister({ username, email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);

    return data;
  };

  // ===============================
  // LOGOUT
  // ===============================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);