import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(

        localStorage.getItem("token") || ""

    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {

            setUser(JSON.parse(storedUser));

        }

        setLoading(false);

    }, []);

    const login = (userData, jwtToken) => {

        setUser(userData);

        setToken(jwtToken);

        localStorage.setItem(

            "user",

            JSON.stringify(userData)

        );

        localStorage.setItem(

            "token",

            jwtToken

        );

        localStorage.setItem(

            "role",

            userData.role || "Customer"

        );

    };

    const logout = () => {

        setUser(null);

        setToken("");

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        localStorage.removeItem("role");

    };

    const updateUser = (newUser) => {

        setUser(newUser);

        localStorage.setItem(

            "user",

            JSON.stringify(newUser)

        );

    };

    return (

        <AuthContext.Provider

            value={{

                user,

                token,

                loading,

                login,

                logout,

                updateUser,

                isAuthenticated: !!token

            }}

        >

            {children}

        </AuthContext.Provider>

    );

};

export const useAuthContext = () => {

    return useContext(AuthContext);

};

export default AuthContext;