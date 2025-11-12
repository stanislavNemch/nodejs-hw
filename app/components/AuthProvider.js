"use client";
import {
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

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Важливо для завантаження
    const router = useRouter();

    /**
     * Ця функція - найважливіша.
     * Вона перевіряє, чи є в нас дійсний accessToken.
     * Якщо ні, вона намагається оновити сесію через refreshToken.
     */
    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Спробуємо отримати користувача.
            // Якщо accessToken дійсний, ми отримаємо дані.
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            // 2. Якщо accessToken прострочений (401), спробуємо оновити сесію
            if (error.message.includes("expired")) {
                try {
                    await refreshSession();
                    // 3. Якщо оновлення пройшло, пробуємо ще раз отримати користувача
                    const currentUser = await getCurrentUser();
                    setUser(currentUser);
                } catch (refreshError) {
                    // 4. Якщо refresh-токен теж прострочений, користувач не залогінений
                    setUser(null);
                }
            } else {
                // Інша помилка (напр. 401 Session not found)
                setUser(null);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Перевіряємо статус при першому завантаженні
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = async (email, password) => {
        const loggedInUser = await loginUser({ email, password });
        setUser(loggedInUser);
        router.push("/notes"); // Перенаправляємо на сторінку нотаток
    };

    const register = async (email, password) => {
        const registeredUser = await registerUser({ email, password });
        setUser(registeredUser);
        router.push("/notes");
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
        router.push("/login");
    };

    const value = {
        user,
        setUser, //Додаємо setUser, щоб профіль міг оновити аватар
        isLoading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
