"use client";
import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { getNotes, createNote, deleteNote } from "../../../lib/api";
import Link from "next/link";
import { TAGS } from "../../../../constants/tags";
import styles from "./Notes.module.css";

export default function NotesPage() {
    const [notesData, setNotesData] = useState({ notes: [], totalPages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Стан для фільтрів
    const [page, setPage] = useState(1);
    const [tag, setTag] = useState("");
    const [search, setSearch] = useState("");

    // Стан для нової нотатки
    const [newTitle, setNewTitle] = useState("");

    // Функція для завантаження нотаток
    const fetchNotes = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = { page, tag, search };
            // Видаляємо пусті параметри
            if (!tag) delete params.tag;
            if (!search) delete params.search;

            const data = await getNotes(params);
            setNotesData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [page, tag, search]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleCreateNote = async (e) => {
        e.preventDefault();
        try {
            await createNote({ title: newTitle });
            setNewTitle("");
            fetchNotes(); // Оновлюємо список
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteNote = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await deleteNote(id);
                fetchNotes(); // Оновлюємо список
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <ProtectedRoute>
            <h1>My Notes</h1>

            {/* Форма створення */}
            <form onSubmit={handleCreateNote} className={styles.filters}>
                <input
                    type="text"
                    placeholder="New note title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                />
                <button type="submit" className="button">
                    Create Note
                </button>
            </form>

            {/* Фільтри */}
            <div className={styles.filters}>
                <input
                    type="search"
                    placeholder="Search in notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={tag} onChange={(e) => setTag(e.target.value)}>
                    <option value="">All Tags</option>
                    {TAGS.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
                <button onClick={() => fetchNotes()} className="button">
                    Apply
                </button>
            </div>

            {error && <p className="form-error">{error}</p>}

            {/* Список нотаток */}
            {isLoading ? (
                <p>Loading notes...</p>
            ) : (
                <div className={styles["notes-grid"]}>
                    {notesData.notes.map((note) => (
                        <div key={note._id} className={styles["note-card"]}>
                            <h3 className={styles["note-title"]}>
                                {note.title}
                            </h3>
                            <p className={styles["note-content"]}>
                                {note.content.substring(0, 100)}...
                            </p>
                            <span className={styles["note-tag"]}>
                                {note.tag}
                            </span>
                            <div className={styles.controls}>
                                <Link
                                    href={`/notes/${note._id}`}
                                    className="button"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDeleteNote(note._id)}
                                    className="button"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Пагінація */}
            <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
                <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page <= 1}
                    className="button"
                >
                    Previous
                </button>
                <span>
                    Page {notesData.page} of {notesData.totalPages}
                </span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= notesData.totalPages}
                    className="button"
                >
                    Next
                </button>
            </div>
        </ProtectedRoute>
    );
}
