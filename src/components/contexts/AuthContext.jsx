/* eslint-disable react/prop-types */
import { onAuthStateChanged } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth } from "../../api/firebase";
import { loginUser, logOutUser, registerUser } from "../../api/auth";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const initializeUser = async (user) => {
        console.log(user)
        if (user) {
            setCurrentUser(user);
            setLoggedIn(true);
        } else {
            setCurrentUser(null);
            setLoggedIn(false);
        }
        setLoading(false);
    }

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, initializeUser);
        return unsub;
    }, [])

    return (
        <AuthContext.Provider value={{
            currentUser,
            loggedIn,
            loading,
            registerUser,
            loginUser,
            logOutUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}