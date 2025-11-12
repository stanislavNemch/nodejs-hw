"use client";
import { useState } from "react";
import { requestResetEmail } from "../../lib/api";

export default function RequestResetPage() {
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
            const res = await requestResetEmail({ email });
            setMessage(res.message);
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
            <h1 className="form-title">Reset Password</h1>
            <p style={{ marginBottom: "16px", textAlign: "center" }}>
                Enter your email, and we will send you a link to reset your
                password.
            </p>
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
                {message && <p className="form-message">{message}</p>}
                {error && <p className="form-error">{error}</p>}
                <button
                    type="submit"
                    className="button"
                    style={{ width: "100%" }}
                >
                    Send Reset Link
                </button>
            </form>
        </div>
    );
}
