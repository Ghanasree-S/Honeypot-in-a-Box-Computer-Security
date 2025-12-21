import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    user: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Hardcoded admin credentials (in production, use proper backend auth)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'honeypot123'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<string | null>(null);

    // Check for existing session on mount
    useEffect(() => {
        const savedAuth = sessionStorage.getItem('honeypot_auth');
        if (savedAuth) {
            const authData = JSON.parse(savedAuth);
            setIsAuthenticated(true);
            setUser(authData.username);
        }
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            setIsAuthenticated(true);
            setUser(username);
            sessionStorage.setItem('honeypot_auth', JSON.stringify({ username, timestamp: Date.now() }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        sessionStorage.removeItem('honeypot_auth');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
