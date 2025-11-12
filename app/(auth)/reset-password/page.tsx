"use client";
import { useState, Suspense } from "react";
import { resetPassword } from "../../lib/api";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token"); // Отримуємо токен з URL

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError("No reset token found in URL.");
            return;
        }
        setError("");
        setMessage("");
        try {
            const res = await resetPassword({ token, password });
            setMessage(res.message);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-title">Set New Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                        id="password"
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </div>
                {message && <p className="form-message">{message}</p>}
                {error && <p className="form-error">{error}</p>}

                <button
                    type="submit"
                    className="button"
                    style={{ width: "100%" }}
                    disabled={!token}
                >
                    Set New Password
                </button>
            </form>
        </div>
    );
}

// Обертываем в Suspense, так как useSearchParams требует этого
export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordForm />
        </Suspense>
    );
}
