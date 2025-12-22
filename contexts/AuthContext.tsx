import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Render.com Backend URL
const RENDER_BACKEND_URL = 'https://honeypot-in-a-box-computer-security.onrender.com';

// Get API base URL based on environment
const getApiBase = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('onrender.com') || hostname.includes('vercel.app')) {
        return RENDER_BACKEND_URL;
    }
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `http://${hostname}:5000`;
    }
    return '';
};

const API_BASE = getApiBase();

interface User {
    id: number;
    username: string;
    email: string;
    created_at?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    signup: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));

            // Verify token is still valid
            verifyToken(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    const verifyToken = async (authToken: string) => {
        try {
            const response = await fetch(`${API_BASE}/api/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                // Token invalid, clear auth
                logout();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('authUser', JSON.stringify(data.user));
                return { success: true, message: 'Login successful' };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    };

    const signup = async (username: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch(`${API_BASE}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('authUser', JSON.stringify(data.user));
                return { success: true, message: 'Account created successfully' };
            } else {
                return { success: false, message: data.message || 'Signup failed' };
            }
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!token && !!user,
            user,
            token,
            isLoading,
            login,
            signup,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
