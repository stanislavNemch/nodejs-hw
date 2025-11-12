"use client";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import styles from "./Header.module.css";

export default function Header() {
    const { user, logout, isLoading } = useAuth();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.nav}`}>
                <Link href="/" className={styles.logo}>
                    NotesApp
                </Link>
                <nav>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className={styles.navList}>
                            {user ? (
                                <>
                                    <Link href="/notes">Notes</Link>
                                    <Link href="/profile">
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className={styles.avatar}
                                        />
                                    </Link>
                                    <button onClick={logout} className="button">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">Login</Link>
                                    <Link href="/register">Register</Link>
                                </>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
