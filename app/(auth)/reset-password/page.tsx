"use client";
import { useState, Suspense } from "react";
import { resetPassword } from "../../lib/api";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    // Додамо стан завантаження, щоб блокувати кнопку під час запиту
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) {
            setError("No reset token found in URL.");
            return;
        }
        setError("");
        setMessage("");
        setIsSubmitting(true); // Блокуємо кнопку
        try {
            const res = await resetPassword({ token, password });
            setMessage(res.message);
            // Перенаправлення через 3 секунди
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
            setIsSubmitting(false); // Розблокуємо кнопку
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
                        disabled={isSubmitting} // Блокуємо інпут під час відправки
                    />
                </div>
                {/* Відображаємо повідомлення про успіх або помилку */}
                {message && (
                    <p className="form-message">
                        {message}. Redirecting to login...
                    </p>
                )}
                {error && <p className="form-error">{error}</p>}
                <button
                    type="submit"
                    className="button"
                    style={{ width: "100%" }}
                    disabled={!token || isSubmitting} // Блокуємо кнопку
                >
                    {isSubmitting ? "Processing..." : "Set New Password"}
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
