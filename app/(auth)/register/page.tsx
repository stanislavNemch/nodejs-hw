"use client";
import { useState } from "react";
import { useAuth } from "../../components/AuthProvider";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await register(email, password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-title">Register</h1>
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
                    <label htmlFor="password">Password (min 8 chars)</label>
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
                {error && <p className="form-error">{error}</p>}
                <button
                    type="submit"
                    className="button"
                    style={{ width: "100%" }}
                >
                    Register
                </button>
            </form>
        </div>
    );
}
