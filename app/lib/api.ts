import { PaginatedNotesResponse, User, Note } from "./types";

// Адрес бэкенда
const API_URL = "/api";

// Типізуємо опції
interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

/**
 * Головна функція для всіх API-запитів з типізацією.
 * Вона автоматично включає 'credentials: "include"'.
 */
async function fetchApi<T>(
    path: string,
    options: FetchOptions = {}
): Promise<T> {
    const url = `${API_URL}${path}`;

    const defaultOptions: FetchOptions = {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    };

    if (options.body instanceof FormData) {
        if (defaultOptions.headers) {
            delete defaultOptions.headers["Content-Type"];
        }
    }

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
    }

    if (response.status === 204) {
        return null as T;
    }

    return response.json() as Promise<T>;
}

async function fetchAuth<T>(
    path: string,
    options: FetchOptions = {}
): Promise<T> {
    // тут немає API_URL, це локальний запит
    const url = `/api${path}`;

    const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Auth error");
    }
    if (response.status === 204) return null as T;
    return response.json() as Promise<T>;
}

// === AUTH API ===
export const registerUser = (data: object): Promise<User> =>
    fetchAuth<User>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const loginUser = (data: object): Promise<User> =>
    fetchAuth<User>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const logoutUser = (): Promise<null> =>
    fetchAuth<null>("/auth/logout", { method: "POST" });

export const refreshSession = (): Promise<{ message: string }> =>
    fetchAuth<{ message: string }>("/auth/refresh", { method: "POST" });

export const requestResetEmail = (data: {
    email: string;
}): Promise<{ message: string }> =>
    fetchAuth<{ message: string }>("/auth/request-reset-email", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const resetPassword = (data: {
    token: string;
    password: string;
}): Promise<{ message: string }> =>
    fetchAuth<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
    });

// === USER API ===
export const getCurrentUser = (): Promise<User> => fetchApi<User>("/users/me");

export const updateUserAvatar = (
    formData: FormData
): Promise<{ url: string }> =>
    fetchApi<{ url: string }>("/users/me/avatar", {
        method: "PATCH",
        body: formData,
    });

// === NOTES API ===
export const getNotes = (
    params: Record<string, string | number>
): Promise<PaginatedNotesResponse> => {
    // Конвертуємо всі значення в рядки для URLSearchParams
    const queryParams = new URLSearchParams();
    for (const key in params) {
        queryParams.append(key, String(params[key]));
    }
    const query = queryParams.toString();
    return fetchApi<PaginatedNotesResponse>(`/notes?${query}`);
};

export const getNoteById = (id: string): Promise<Note> =>
    fetchApi<Note>(`/notes/${id}`);

export const createNote = (data: {
    title: string;
    content?: string;
    tag?: string;
}): Promise<Note> =>
    fetchApi<Note>("/notes", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updateNote = (id: string, data: object): Promise<Note> =>
    fetchApi<Note>(`/notes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });

export const deleteNote = (id: string): Promise<Note> =>
    fetchApi<Note>(`/notes/${id}`, { method: "DELETE" });
