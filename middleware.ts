import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSessionServer } from "./app/lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const authRoutes = [
    "/login",
    "/register",
    "/auth/request-reset-email",
    "/auth/reset-password",
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const isPrivateRoute = privateRoutes.some((route) =>
        pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // 1. Якщо ми на логіні/реєстрації, а токен є -> редірект в /notes
    if (isAuthRoute && accessToken) {
        return NextResponse.redirect(new URL("/notes", request.url));
    }

    // 2. Якщо це приватний маршрут
    if (isPrivateRoute) {
        // А. Токен є - пропускаємо
        if (accessToken) {
            return NextResponse.next();
        }

        // Б. Токена немає, але є Refresh Token -> пробуємо оновити!
        if (refreshToken) {
            try {
                const data = await checkSessionServer();
                const setCookies = data.headers["set-cookie"];

                if (setCookies && setCookies.length > 0) {
                    const response = NextResponse.next();

                    // Встановлюємо нові куки, отримані від бекенда
                    setCookies.forEach((cookie) => {
                        response.headers.append("Set-Cookie", cookie);
                    });

                    return response;
                }
            } catch (error) {
                console.error("Middleware refresh failed:", error);
                // Якщо оновити не вийшло - йдемо до редіректу на логін
            }
        }

        // В. Нічого не допомогло -> редірект на логін
        const loginUrl = new URL("/login", request.url);
        // (Опціонально) Можна додати ?next=... щоб повернути юзера назад
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
