import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function proxy(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const pathString = path.join("/");
    const url = `${BACKEND_URL}/${pathString}${request.nextUrl.search}`;

    try {
        // 1. БЕЗПЕЧНО отримуємо тіло запиту
        let body;
        const reqContentType = request.headers.get("content-type");

        if (
            request.method !== "GET" &&
            request.method !== "DELETE" &&
            reqContentType?.includes("application/json")
        ) {
            try {
                body = await request.json();
            } catch {
                body = undefined;
            }
        }

        // 2. Відправляємо запит на БЕКЕНД
        const backendResponse = await fetch(url, {
            method: request.method,
            headers: {
                "Content-Type": "application/json",
                Cookie: request.headers.get("cookie") || "",
            },
            body: body ? JSON.stringify(body) : undefined,
            cache: "no-store",
        });

        // 3. БЕЗПЕЧНО отримуємо дані від бекенда
        let data = null;
        const resContentType = backendResponse.headers.get("content-type");

        if (
            resContentType?.includes("application/json") &&
            backendResponse.status !== 204
        ) {
            try {
                data = await backendResponse.json();
            } catch {
                console.error("Failed to parse backend response JSON");
            }
        }

        // 4. Правильно створюємо відповідь залежно від статусу
        let response: NextResponse;

        if (backendResponse.status === 204) {
            // Для 204 тіло ОБОВ'ЯЗКОВО має бути null
            response = new NextResponse(null, { status: 204 });
        } else {
            // Для інших статусів повертаємо JSON
            response = NextResponse.json(data || {}, {
                status: backendResponse.status,
            });
        }

        // 5. Копіюємо заголовки Set-Cookie (для логіну/логауту)
        const setCookieHeader = backendResponse.headers.get("set-cookie");
        if (setCookieHeader) {
            response.headers.set("Set-Cookie", setCookieHeader);
        }

        return response;
    } catch (error) {
        console.error("❌ Proxy Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error (Proxy)" },
            { status: 500 }
        );
    }
}

export { proxy as GET, proxy as POST, proxy as PATCH, proxy as DELETE };
