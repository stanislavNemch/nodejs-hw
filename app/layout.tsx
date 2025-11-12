import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import Header from "./components/Header";

export const metadata = {
    title: "My Notes App",
    description: "Frontend for my Node.js notes API",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <Header />
                    <main className="container">{children}</main>
                </AuthProvider>
            </body>
        </html>
    );
}
