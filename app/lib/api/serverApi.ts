import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function checkSessionServer() {
    const cookieStore = await cookies();

    // 1. Збираємо куки для відправки на бекенд
    // Бекенду потрібні refreshToken та sessionId
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!refreshToken || !sessionId) {
        throw new Error("No tokens found");
    }

    // 2. Робимо запит на оновлення сесії
    const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // ! ВАЖЛИВО: Вручну передаємо куки, бо ми на сервері
            Cookie: `refreshToken=${refreshToken}; sessionId=${sessionId}`,
        },
        cache: "no-store", // Не кешувати цей запит
    });

    if (!response.ok) {
        throw new Error("Failed to refresh session");
    }

    // 3. Повертаємо дані, які очікує middleware
    // Нам потрібно витягнути заголовки Set-Cookie

    // Отримуємо raw headers
    const setCookieHeader = response.headers.get("set-cookie");

    // Node.js fetch може повернути один рядок з комами або null
    // Нам зручніше повернути об'єкт
    return {
        headers: {
            "set-cookie": setCookieHeader,
        },
    };
}
