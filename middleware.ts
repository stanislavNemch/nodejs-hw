import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSessionServer } from "./app/lib/api/serverApi";

// Наші маршрути
const privateRoutes = ["/notes", "/profile"];
const authRoutes = [
    "/login",
    "/register",
    "/request-reset-email",
    "/reset-password",
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Отримуємо токени
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const isPrivateRoute = privateRoutes.some((route) =>
        pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // 1. Якщо ми на сторінці логіну, а токен є -> редірект в /notes
    if (isAuthRoute && accessToken) {
        return NextResponse.redirect(new URL("/notes", request.url));
    }

    // 2. Якщо це приватний маршрут
    if (isPrivateRoute) {
        // А. Все добре, токен є
        if (accessToken) {
            return NextResponse.next();
        }

        // Б. Токена немає, але є Refresh Token -> пробуємо оновити!
        if (refreshToken) {
            try {
                // Викликаємо нашу серверну функцію
                const data = await checkSessionServer();
                const setCookie = data.headers["set-cookie"];

                if (setCookie) {
                    // Створюємо відповідь, яка каже "пропускай далі"
                    const response = NextResponse.next();

                    // Ми беремо нові куки від бекенда і "прикріплюємо" їх до відповіді браузеру.
                    // Таким чином, браузер одразу оновить куки, і користувач не помітить розлогіну.

                    // Обробка set-cookie (може бути рядок або масив, залежить від версії Node)
                    // split(',') - проста евристика, але для set-cookie краще використовувати бібліотеку 'set-cookie-parser'
                    // Однак для простоти, якщо прийшов один рядок:
                    response.headers.set("Set-Cookie", setCookie);

                    return response;
                }
            } catch (error) {
                console.error("Middleware refresh failed:", error);
                // Якщо оновити не вийшло - йдемо до редіректу на логін
            }
        }

        // В. Нічого не допомогло -> редірект на логін
        const loginUrl = new URL("/login", request.url);
        // Можна додати ?next=/notes, щоб повернути користувача потім
        // loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    // Матчер для виключення статики та API
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
