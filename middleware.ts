import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Список "захищених" маршрутів
const protectedPaths = ["/notes", "/profile"];

// Список "публічних" маршрутів (для аутентифікації)
const authPaths = [
    "/login",
    "/register",
    "/auth/request-reset-email",
    "/auth/reset-password",
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Отримуємо cookie 'accessToken'
    const accessToken = request.cookies.get("accessToken")?.value;

    // 2. Логіка для ЗАХИЩЕНИХ маршрутів
    if (protectedPaths.some((path) => pathname.startsWith(path))) {
        // Якщо користувач намагається зайти на захищений маршрут
        // БЕЗ токена, перенаправляємо його на /login
        if (!accessToken) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // 3. Логіка для ПУБЛІЧНИХ (auth) маршрутів
    if (authPaths.some((path) => pathname.startsWith(path))) {
        // Якщо користувач ВЖЕ залогінений (має токен)
        // і намагається зайти на /login або /register,
        // перенаправляємо його на головну сторінку нотаток
        if (accessToken) {
            return NextResponse.redirect(new URL("/notes", request.url));
        }
    }

    // 4. В усіх інших випадках - просто пропускаємо запит
    return NextResponse.next();
}

// Конфігурація: вказуємо, де middleware НЕ повинен працювати
export const config = {
    matcher: [
        /*
         * Відповідає всім шляхам, ОКРІМ:
         * - /api (API маршрути)
         * - /_next/static (статичні файли)
         * - /_next/image (оптимізація зображень)
         * - /favicon.ico (іконка)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
