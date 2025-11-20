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
import { User, AuthContextType } from "../lib/types";

// Створюємо контекст з правильним типом
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Хук useAuth, який ПЕРЕВІРЯЄ, що контекст не null.
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
        // Проверяем "подсказку" в localStorage перед тем, как делать запрос
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (!isLoggedIn) {
            setUser(null);
            setIsLoading(false);
            return; // Если флага нет, не делаем запрос к API
        }

        setIsLoading(true);
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error: unknown) {
            let errorMessage = "An unknown auth error occurred";
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            if (errorMessage.includes("expired")) {
                try {
                    await refreshSession();
                    const currentUser = await getCurrentUser();
                    setUser(currentUser);
                } catch {
                    setUser(null);
                    localStorage.removeItem("isLoggedIn"); // Удаляем флаг, если сессия умерла окончательно
                }
            } else {
                setUser(null);
                localStorage.removeItem("isLoggedIn"); // Удаляем флаг при ошибке
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = async (email: string, password: string) => {
        await loginUser({ email, password });
        localStorage.setItem("isLoggedIn", "true"); // Ставим флаг
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        router.push("/notes");
    };

    const register = async (email: string, password: string) => {
        await registerUser({ email, password });
        localStorage.setItem("isLoggedIn", "true"); // Ставим флаг
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        router.push("/notes");
    };

    const logout = async () => {
        await logoutUser();
        localStorage.removeItem("isLoggedIn"); // Удаляем флаг
        setUser(null);
        router.push("/login");
    };

    const value: AuthContextType = {
        user,
        setUser,
        isLoading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
