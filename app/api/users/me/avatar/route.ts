import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function PATCH(request: NextRequest) {
    try {
        // Получаем FormData напрямую из запроса
        const formData = await request.formData();

        // Получаем cookies из запроса (для сессии)
        const cookies = request.headers.get("cookie") || "";

        // Проксируем на бэкенд
        const response = await fetch(`${BACKEND_URL}/users/me/avatar`, {
            method: "PATCH",
            headers: {
                cookie: cookies, // передаём сессию
            },
            body: formData, // передаём FormData как есть
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(error, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Avatar upload proxy error:", error);
        return NextResponse.json({ message: "Proxy error" }, { status: 500 });
    }
}
