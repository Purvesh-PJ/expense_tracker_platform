import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); // Track user details
    const navigate = useNavigate();

    useEffect(() => {
        // Check for JWT token and user details on app initialization
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Get the current time in seconds

                // Check if the token is expired
                if (decodedToken.exp < currentTime) {
                    // Token is expired
                    logout();
                    navigate('/Login');
                } else {
                    // Token is valid
                    setIsAuthenticated(true);
                    setUser(JSON.parse(storedUser)); // Set user from localStorage
                }
            } catch (err) {
                console.error('Invalid token:', err);
                logout();
                navigate('/Login');
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
            navigate('/Login');
        }

        setLoading(false);
    }, []);

    const login = (token) => {
        if (token) {
            localStorage.setItem('authToken', token); // Save token to localStorage
            const decodedToken = jwtDecode(token); // Decode token to extract user info
            const userDetails = { id: decodedToken.id, username: decodedToken.username }; // Extract user details
            localStorage.setItem('user', JSON.stringify(userDetails)); // Save user details to localStorage
            setIsAuthenticated(true);
            setUser(userDetails); // Update user state
        } else {
            console.error('Token is missing during login');
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken'); // Clear token from localStorage
        localStorage.removeItem('user'); // Clear user details
        setIsAuthenticated(false);
        setUser(null); // Clear user state
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
