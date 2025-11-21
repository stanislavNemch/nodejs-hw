import { cookies } from "next/headers";

// Адреса вашого бекенда
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function checkSessionServer() {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value;
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!refreshToken || !sessionId) {
        throw new Error("No tokens found");
    }

    // Робимо запит на бекенд від імені сервера Next.js
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Вручну передаємо куки
            Cookie: `refreshToken=${refreshToken}; sessionId=${sessionId}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to refresh session");
    }

    // Повертаємо заголовки Set-Cookie, які прислав бекенд
    // (Next.js Middleware потім передасть їх у браузер)
    const setCookieHeader = response.headers.get("set-cookie");

    return {
        headers: {
            "set-cookie": setCookieHeader ? [setCookieHeader] : [],
        },
    };
}
