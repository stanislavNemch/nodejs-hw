"use client";
import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { getNoteById, updateNote } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { TAGS } from "../../../../src/constants/tags";

export default function EditNotePage({ params }) {
    const { id } = params;
    const router = useRouter();
    const [note, setNote] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tag, setTag] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const fetchNote = useCallback(async () => {
        try {
            const data = await getNoteById(id);
            setNote(data);
            setTitle(data.title);
            setContent(data.content);
            setTag(data.tag);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchNote();
    }, [fetchNote]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateNote(id, { title, content, tag });
            router.push("/notes"); // Повертаємось до списку
        } catch (err) {
            setError(err.message);
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
                            onChange={(e) => setTitle(e.target.value)}
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
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tag">Tag</label>
                        <select
                            id="tag"
                            className="form-input"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                        >
                            {TAGS.map((t) => (
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
