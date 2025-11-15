import React from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
import AuthLayout from "@/layouts/AuthLayout";

export default function RegisterPage() {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/auth/register/post");
    };

    return (
        <AuthLayout>
            <div className="flex min-h-screen items-center justify-center bg-muted">
                <div className="w-full max-w-md bg-background rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-semibold mb-2">Daftar</h1>
                    <p className="text-sm text-muted-foreground mb-4">
                        Buat akun baru untuk menggunakan aplikasi.
                    </p>

                    {flash?.error && (
                        <div className="mb-3 rounded-md bg-red-100 text-red-700 text-sm px-3 py-2">
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label htmlFor="name" className="text-sm font-medium">
                                Nama
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="w-full rounded-md border border-input px-3 py-2 text-sm"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-600">{errors.name}</p>
                            )}
                        </div>

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

                        <div className="space-y-1">
                            <label
                                htmlFor="password_confirmation"
                                className="text-sm font-medium"
                            >
                                Konfirmasi Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                className="w-full rounded-md border border-input px-3 py-2 text-sm"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData("password_confirmation", e.target.value)
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 w-full rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 disabled:bg-muted"
                        >
                            {processing ? "Memproses..." : "Daftar"}
                        </button>

                        <p className="text-center text-xs text-muted-foreground mt-2">
                            Sudah punya akun?{" "}
                            <Link
                                href="/auth/login"
                                className="text-primary hover:underline"
                            >
                                Masuk di sini
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
}
