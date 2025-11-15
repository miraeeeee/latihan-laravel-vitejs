import React from "react";
import { Link, router } from "@inertiajs/react";

export default function AppLayout({ children }) {
    const onLogout = () => {
        router.get("/auth/logout");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Navigation */}
            <nav className="border-b bg-card">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <Link
                                href="/"
                                className="text-lg font-semibold text-primary"
                            >
                                Aplikasi Laravel
                            </Link>
                            <Link href="/app" className="text-sm text-muted-foreground hover:text-primary">
                                Dashboard
                            </Link>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link
                                href="/auth/login"
                                className="text-sm text-muted-foreground hover:text-primary"
                            >
                                Login
                            </Link>
                            <button
                                type="button"
                                onClick={onLogout}
                                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t bg-card py-6 mt-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    &copy; 2025 Delcom Labs. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
