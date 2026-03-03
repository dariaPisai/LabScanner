import React, { createContext, useContext, useState } from 'react';
import { apiLogin, apiRegister, clearToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signIn = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiLogin(email, password);
            setUser({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                memberSince: data.user.memberSince,
            });
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async ({ name, email, password }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRegister(name, email, password);
            setUser({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                memberSince: data.user.memberSince,
            });
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signOut = () => {
        clearToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
