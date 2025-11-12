"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./components/AuthProvider";

export default function HomePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                router.push("/notes");
            } else {
                router.push("/login");
            }
        }
    }, [user, isLoading, router]);

    return (
        <div className="container">
            <p>Loading...</p>
        </div>
    );
}
