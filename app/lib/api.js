// Адрес вашего бэкенда
const API_URL = "http://localhost:3000";

/**
 * Головна функція для всіх API-запитів.
 * Вона автоматично включає 'credentials: "include"'
 * що НЕОБХІДНО для роботи http-only cookies.
 */
async function fetchApi(path, options = {}) {
    const url = `${API_URL}${path}`;

    const defaultOptions = {
        // ! Цей прапор каже браузеру завжди відправляти cookies
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    };

    // Якщо ми завантажуємо файл, ми не ставимо Content-Type
    if (options.body instanceof FormData) {
        delete defaultOptions.headers["Content-Type"];
    }

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
    }

    // Для 204 No Content (як-от /logout)
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

// === AUTH API ===
export const registerUser = (data) =>
    fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const loginUser = (data) =>
    fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const logoutUser = () => fetchApi("/auth/logout", { method: "POST" });

export const refreshSession = () =>
    fetchApi("/auth/refresh", { method: "POST" });

export const requestResetEmail = (data) =>
    fetchApi("/auth/request-reset-email", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const resetPassword = (data) =>
    fetchApi("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
    });

// === USER API ===
export const getCurrentUser = () => fetchApi("/users/me");

export const updateUserAvatar = (formData) =>
    fetchApi("/users/me/avatar", {
        method: "PATCH",
        body: formData, // FormData автоматично встановить правильний Content-Type
    });

// === NOTES API ===
export const getNotes = (params) => {
    // params - це об'єкт { page: 1, tag: 'Work', ... }
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/notes?${query}`);
};

export const getNoteById = (id) => fetchApi(`/notes/${id}`);

export const createNote = (data) =>
    fetchApi("/notes", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updateNote = (id, data) =>
    fetchApi(`/notes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });

export const deleteNote = (id) =>
    fetchApi(`/notes/${id}`, { method: "DELETE" });
