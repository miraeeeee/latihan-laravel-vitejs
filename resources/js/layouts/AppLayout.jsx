import React from "react";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";

export default function AppLayout({ children }) {
    const onLogout = () => {
        router.get("/auth/logout");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b bg-card">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <Link
                                href="/"
                                className="text-xl font-bold tracking-tight"
                            >
                                Delcom Todos
                            </Link>
                            <div className="flex items-center space-x-4 text-sm">
                                <Link
                                    href="/"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    Beranda
                                </Link>
                                <Link
                                    href="/todos"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    Todos
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button

                                variant="outline"
                                size="sm"
                                onClick={onLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t bg-card py-6 mt-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    &copy; 2025 Delcom Labs. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
