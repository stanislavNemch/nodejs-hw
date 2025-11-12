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

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Спробуємо отримати користувача
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error: unknown) {
            // 2. Якщо 'getCurrentUser' не вдався (напр., токен 401),
            // це ще не кінець. Спробуємо оновити сесію.
            let errorMessage = "An unknown auth error occurred";
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            // Перевіряємо, чи помилка пов'язана з сесією
            if (
                errorMessage.includes("expired") ||
                errorMessage.includes("401")
            ) {
                try {
                    // 3. Намагаємось оновити сесію
                    await refreshSession();
                    // 4. Якщо вдалося, знову запитуємо користувача
                    const currentUser = await getCurrentUser();
                    setUser(currentUser);
                } catch {
                    // 5. Якщо і refresh не вдався - користувач не залогінений
                    setUser(null);
                }
            } else {
                // Інша помилка (не 401)
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
