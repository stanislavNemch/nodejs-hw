"use client";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Ждем, пока AuthProvider завершить перевірку
        if (!isLoading) {
            // Якщо перевірка завершилась і користувача НЕМАЄ
            if (!user) {
                // Примусово відправляємо на логін
                router.push("/login");
            }
        }
    }, [user, isLoading, router]); // Залежимо від isLoading

    // Поки йде перевірка, нічого не показуємо
    if (isLoading) {
        return (
            <div className="container">
                <p>Checking authentication...</p>
            </div>
        );
    }

    // Якщо перевірка завершилась і користувач Є
    if (user) {
        return <>{children}</>;
    }
    return null;
}
