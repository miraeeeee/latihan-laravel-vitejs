import React, { useEffect } from "react";
import AppLayout from "@/layouts/AppLayout";
import { useForm, usePage, Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import Chart from "react-apexcharts";

export default function TodosIndex() {
    const { auth, todos, filters, stats, flash } = usePage().props;

    const form = useForm({
        title: "",
        note: "",
        due_date: "",
        is_completed: false,
        cover: null,
    });

    // SweetAlert untuk flash success/error
    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: flash.success,
                timer: 2000,
                showConfirmButton: false,
            });
        }

        if (flash?.error) {
            Swal.fire({
                icon: "error",
                title: "Terjadi Kesalahan",
                text: flash.error,
            });
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // CREATE TODO → POST /todos
        form.post("/todos", {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                form.clearErrors();
            },
        });
    };

    const onDelete = (todo) => {
        Swal.fire({
            title: "Hapus Todo?",
            text: `Kamu akan menghapus "${todo.title}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/todos/${todo.id}`, {
                    preserveScroll: true,
                });
            }
        });
    };

    const onSearchSubmit = (e) => {
        e.preventDefault();
        const data = {
            q: e.target.q.value,
            status: e.target.status.value,
        };
        router.get("/todos", data, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const chartOptions = {
        labels: ["Selesai", "Belum Selesai"],
        legend: {
            position: "bottom",
        },
    };

    const chartSeries = [stats.completed, stats.pending];

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Todos {auth?.name && `- ${auth.name}`}
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola aktivitas yang akan kamu lakukan.
                        </p>
                    </div>
                    <Link href="/">
                        <button variant="outline" size="sm">
                            Kembali ke Beranda
                        </button>
                    </Link>
                </div>

                {/* Grid: Form + Statistik */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Form Tambah */}
                    <div className="lg:col-span-2 border rounded-lg p-6 bg-card">
                        <h2 className="text-lg font-semibold mb-4">
                            Tambah Todo
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="title">Judul</Label>
                                <Input
                                    id="title"
                                    value={form.data.title}
                                    onChange={(e) =>
                                        form.setData("title", e.target.value)
                                    }
                                />
                                {form.errors.title && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {form.errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="note">
                                    Catatan (bisa diisi dengan Trix Editor –
                                    opsional)
                                </Label>
                                <textarea
                                    id="note"
                                    className="mt-1 w-full border rounded-md p-2 text-sm min-h-[80px]"
                                    value={form.data.note}
                                    onChange={(e) =>
                                        form.setData("note", e.target.value)
                                    }
                                />
                                {form.errors.note && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {form.errors.note}
                                    </p>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="due_date">
                                        Tanggal Jatuh Tempo
                                    </Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={form.data.due_date || ""}
                                        onChange={(e) =>
                                            form.setData(
                                                "due_date",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {form.errors.due_date && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {form.errors.due_date}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 mt-6 md:mt-8">
                                    <input
                                        id="is_completed"
                                        type="checkbox"
                                        checked={form.data.is_completed}
                                        onChange={(e) =>
                                            form.setData(
                                                "is_completed",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <Label htmlFor="is_completed">
                                        Tandai sebagai selesai
                                    </Label>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="cover">Cover (gambar)</Label>
                                <Input
                                    id="cover"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        form.setData(
                                            "cover",
                                            e.target.files[0] || null
                                        )
                                    }
                                />
                                {form.errors.cover && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {form.errors.cover}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                >
                                    Tambah
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Statistik */}
                    <div className="border rounded-lg p-6 bg-card flex flex-col">
                        <h2 className="text-lg font-semibold mb-4">
                            Statistik Todos
                        </h2>
                        <div className="space-y-2 mb-4 text-sm">
                            <p>Total: {stats.total}</p>
                            <p>Selesai: {stats.completed}</p>
                            <p>Belum Selesai: {stats.pending}</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            {stats.total > 0 ? (
                                <Chart
                                    options={chartOptions}
                                    series={chartSeries}
                                    type="donut"
                                    height={260}
                                />
                            ) : (
                                <p className="text-xs text-muted-foreground text-center">
                                    Belum ada data untuk ditampilkan di grafik.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="border rounded-lg p-4 bg-card mb-4">
                    <form
                        onSubmit={onSearchSubmit}
                        className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0"
                    >
                        <div className="flex-1">
                            <Label htmlFor="q">Pencarian</Label>
                            <Input
                                id="q"
                                name="q"
                                placeholder="Cari berdasarkan judul..."
                                defaultValue={filters.q || ""}
                            />
                        </div>
                        <div>
                            <Label htmlFor="status">Filter Status</Label>
                            <select
                                id="status"
                                name="status"
                                defaultValue={filters.status || ""}
                                className="mt-1 border rounded-md px-2 py-1 text-sm"
                            >
                                <option value="">Semua</option>
                                <option value="completed">Selesai</option>
                                <option value="pending">Belum Selesai</option>
                            </select>
                        </div>
                        <div className="pt-5 md:pt-6">
                            <button type="submit" variant="outline">
                                Terapkan
                            </button>
                        </div>
                    </form>
                </div>

                {/* List Todos */}
                <div className="border rounded-lg bg-card">
                    {todos.data.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground">
                            Belum ada todo. Tambahkan dari form di atas.
                        </p>
                    ) : (
                        <ul className="divide-y">
                            {todos.data.map((todo) => (
                                <li
                                    key={todo.id}
                                    className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                                >
                                    <div className="flex items-start gap-3">
                                        {todo.cover_path && (
                                            <img
                                                src={`/storage/${todo.cover_path}`}
                                                alt={todo.title}
                                                className="w-16 h-16 object-cover rounded-md border"
                                            />
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">
                                                    {todo.title}
                                                </span>
                                                {todo.is_completed && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                                        Selesai
                                                    </span>
                                                )}
                                            </div>
                                            {todo.due_date && (
    <p className="text-xs text-muted-foreground">
        Jatuh tempo: {new Date(todo.due_date).toLocaleDateString("id-ID")}
    </p>
)}

                                            {todo.note && (
                                                <p className="text-sm mt-1 text-muted-foreground line-clamp-2">
                                                    {todo.note}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Pindah ke halaman edit baru */}
                                        <Link href={`/todos/${todo.id}/edit`}>
                                            <button
                                                size="sm"
                                                variant="outline"
                                            >
                                                Ubah
                                            </button>
                                        </Link>
                                        <button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => onDelete(todo)}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Pagination */}
                    {todos.links.length > 1 && (
                        <div className="flex justify-between items-center px-4 py-3 border-t text-sm">
                            <p className="text-muted-foreground">
                                Halaman {todos.current_page} dari{" "}
                                {todos.last_page}
                            </p>
                            <div className="flex gap-1 flex-wrap">
                               {todos.links.map((link, idx) => {
    let label = link.label;

    if (label === "pagination.previous") label = "«";
    if (label === "pagination.next") label = "»";

    return (
        <button
            key={idx}
            disabled={!link.url}
            onClick={() =>
                link.url &&
                router.get(link.url, {}, {
                    preserveState: true,
                    preserveScroll: true,
                })
            }
            className={`px-2 py-1 rounded ${
                link.active
                    ? "bg-blue-600 text-white"
                    : "bg-muted hover:bg-muted/70"
            } text-xs`}
        >
            {label}
        </button>
    );
})}

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
