"use client";
import { useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-title">Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="form-error">{error}</p>}
                <button
                    type="submit"
                    className="button"
                    style={{ width: "100%" }}
                >
                    Login
                </button>
            </form>
            <p style={{ marginTop: "16px", textAlign: "center" }}>
                <Link href="/auth/request-reset-email">Forgot password?</Link>
            </p>
        </div>
    );
}
