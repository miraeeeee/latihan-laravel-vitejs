import React from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import AuthLayout from "@/layouts/AuthLayout";

export default function LoginPage() {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/auth/login/post");
    };

    return (
        <AuthLayout>
            <div className="flex min-h-screen items-center justify-center bg-muted">
                <div className="w-full max-w-md bg-background rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-semibold mb-2">Masuk</h1>
                    <p className="text-sm text-muted-foreground mb-4">
                        Silakan login untuk melanjutkan.
                    </p>

                    {flash?.success && (
                        <div className="mb-3 rounded-md bg-emerald-100 text-emerald-700 text-sm px-3 py-2">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-3 rounded-md bg-red-100 text-red-700 text-sm px-3 py-2">
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full rounded-md border border-input px-3 py-2 text-sm"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="w-full rounded-md border border-input px-3 py-2 text-sm"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 w-full rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 disabled:bg-muted"
                        >
                            {processing ? "Memproses..." : "Masuk"}
                        </button>

                        <p className="text-center text-xs text-muted-foreground mt-2">
                            Belum punya akun?{" "}
                            <Link
                                href="/auth/register"
                                className="text-primary hover:underline"
                            >
                                Daftar di sini
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
}
