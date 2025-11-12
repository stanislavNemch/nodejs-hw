"use client";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import {
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
    refreshSession,
} from "../lib/api";
import { useRouter } from "next/navigation";
import { User, AuthContextType } from "../lib/types"; // Імпортуємо наші типи

// Створюємо контекст з правильним типом
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Хук useAuth, який ПЕРЕВІРЯЄ, що контекст не null.
 * Саме це виправляє вашу помилку "Property 'user' does not exist on type 'null'".
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Типізуємо children
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error: any) {
            if (error.message.includes("expired")) {
                try {
                    await refreshSession();
                    const currentUser = await getCurrentUser();
                    setUser(currentUser);
                } catch (refreshError) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = async (email: string, password: string) => {
        const loggedInUser = await loginUser({ email, password });
        setUser(loggedInUser);
        router.push("/notes");
    };

    const register = async (email: string, password: string) => {
        const registeredUser = await registerUser({ email, password });
        setUser(registeredUser);
        router.push("/notes");
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
        router.push("/login");
    };

    // Надаємо повний тип для 'value'
    const value: AuthContextType = {
        user,
        setUser, // Це потрібно для оновлення аватара
        isLoading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
