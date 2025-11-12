"use client";
import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { getNotes, createNote, deleteNote } from "../../../lib/api";
import Link from "next/link";
import { TAGS } from "../../../../constants/tags";
import { Note, PaginatedNotesResponse } from "../../../lib/types";
import styles from "./Notes.module.css";

export default function NotesPage() {
    const [notesData, setNotesData] = useState<PaginatedNotesResponse>({
        notes: [], // Початковий стан: пустий масив нотаток
        totalPages: 1,
        page: 1,
        perPage: 10,
        totalNotes: 0,
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // Стан для фільтрів
    const [page, setPage] = useState<number>(1);
    const [tag, setTag] = useState<string>("");
    const [search, setSearch] = useState<string>("");

    // Стан для нової нотатки
    const [newTitle, setNewTitle] = useState<string>("");

    // Функція для завантаження нотаток
    const fetchNotes = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: Record<string, string | number> = { page };
            if (tag) {
                params.tag = tag;
            }
            if (search) {
                params.search = search;
            }

            const data = await getNotes(params);
            setNotesData(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }, [page, tag, search]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleCreateNote = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await createNote({ title: newTitle });
            setNewTitle("");
            fetchNotes(); // Оновлюємо список
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown create error occurred");
            }
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (window.confirm("Are you sure?")) {
            try {
                await deleteNote(id);
                fetchNotes(); // Оновлюємо список
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown delete error occurred");
                }
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewTitle(e.target.value)
                    }
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearch(e.target.value)
                    }
                />
                <select
                    value={tag}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setTag(e.target.value)
                    }
                >
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
                    {notesData.notes.map((note: Note) => (
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
