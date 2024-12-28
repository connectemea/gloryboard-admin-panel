import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize state with token and user data from localStorage
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        return {
            isAuthenticated: !!token,
            user: user ? JSON.parse(user) : null,
        };
    });

    // Login function: stores token and user data in localStorage
    const login = (token, user) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setAuth({ isAuthenticated: true, user });
    };

    // Logout function: clears localStorage and updates state
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuth({ isAuthenticated: false, user: null });
        // navigate('/login');
    };

    // Ensure state is synced with localStorage on page refresh
    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (token && user) {
            setAuth({ isAuthenticated: true, user: JSON.parse(user) });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
