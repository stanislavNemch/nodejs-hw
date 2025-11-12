"use client";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login"); // Якщо не залогінений, відправляємо на логін
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="container">
                <p>Loading page...</p>
            </div>
        );
    }

    if (!user) {
        return null; // Або показувати 401 сторінку
    }

    return children;
}
