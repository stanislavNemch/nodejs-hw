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
        if (!isLoading && !user) {
            router.push("/login");
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
        return null; // Або null, поки відбувається редірект
    }

    // Явно вказуємо, що children - це React вузол
    return <>{children}</>;
}
