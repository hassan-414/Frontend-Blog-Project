import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initialize state from localStorage
    useEffect(() => {
        const initializeAuth = () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            
            if (token && savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Error parsing saved user:', error);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    // Verify token with backend
    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get('https://backend-blog-project-production-67cb.up.railway.app/api/user/verify', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });

                if (response.data.success) {
                    setIsAuthenticated(true);
                    setUser(response.data.user);
                    // Update stored user data
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                } else {
                    handleLogout();
                }
            } catch (error) {
                console.error('Token verification failed:', error);
                handleLogout();
            }
        };

        if (isAuthenticated) {
            verifyToken();
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    const login = async (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
    };

    // Debug log
    useEffect(() => {
        console.log('Auth State Updated:', { 
            isAuthenticated, 
            user, 
            token: localStorage.getItem('token') 
        });
    }, [isAuthenticated, user]);

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                isAuthenticated, 
                loading, 
                login, 
                logout: handleLogout 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 