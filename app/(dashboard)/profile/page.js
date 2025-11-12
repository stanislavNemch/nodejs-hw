"use client";
import { useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../components/AuthProvider";
import { updateUserAvatar } from "../../lib/api";
import styles from "./Profile.module.css";

export default function ProfilePage() {
    const { user, setUser } = useAuth(); // ! Отримуємо setUser
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file.");
            return;
        }

        setError("");
        setIsLoading(true);

        const formData = new FormData();
        formData.append("avatar", file); // 'avatar' - це ключ, який чекає multer

        try {
            const res = await updateUserAvatar(formData);
            // Оновлюємо аватар у глобальному стані!
            setUser({ ...user, avatar: res.url });
            setFile(null); // Очищуємо інпут
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className={styles["profile-card"]}>
                <img
                    src={user?.avatar}
                    alt={user?.username}
                    className={styles.avatar}
                />
                <h2>{user?.username}</h2>
                <p>{user?.email}</p>

                <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
                    <h3 style={{ marginBottom: "10px" }}>Update Avatar</h3>
                    <div className="form-group">
                        <input
                            type="file"
                            accept="image/*"
                            className={styles["file-input"]}
                            onChange={handleFileChange}
                        />
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <button
                        type="submit"
                        className="button"
                        disabled={isLoading || !file}
                    >
                        {isLoading ? "Uploading..." : "Upload"}
                    </button>
                </form>
            </div>
        </ProtectedRoute>
    );
}
