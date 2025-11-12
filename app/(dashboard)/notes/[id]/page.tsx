"use client";
import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { getNoteById, updateNote } from "../../../lib/api";
import { useRouter, useParams } from "next/navigation";
import { TAGS } from "../../../../constants/tags";
import { Note } from "../../../lib/types";
import React from "react";

export default function EditNotePage() {
    const router = useRouter();
    const params = useParams();

    const id = params.id as string;

    const [note, setNote] = useState<Note | null>(null);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [tag, setTag] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchNote = useCallback(async () => {
        if (!id) return; // Додаємо перевірку, що id існує
        try {
            const data = await getNoteById(id);
            setNote(data);
            setTitle(data.title);
            setContent(data.content);
            setTag(data.tag);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchNote();
    }, [fetchNote]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await updateNote(id, { title, content, tag });
            router.push("/notes");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown update error occurred");
            }
        }
    };

    if (isLoading) return <p>Loading note...</p>;
    if (error) return <p className="form-error">{error}</p>;
    if (!note) return null;

    return (
        <ProtectedRoute>
            <div className="form-container">
                <h1 className="form-title">Edit Note</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            className="form-input"
                            rows={5}
                            value={content}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tag">Tag</label>
                        <select
                            id="tag"
                            className="form-input"
                            value={tag}
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                            ) => setTag(e.target.value)}
                        >
                            {TAGS.map((t: string) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="button"
                        style={{ width: "100%" }}
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </ProtectedRoute>
    );
}
