import React, { useEffect } from "react";
import AppLayout from "@/layouts/AppLayout";
import { useForm, usePage, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

export default function TodosEdit() {
    const { auth, todo, flash } = usePage().props;

    // _method: "put" DISIMPAN di data form
    const form = useForm({
        _method: "put",
        title: todo.title || "",
        note: todo.note || "",
        due_date: todo.due_date || "",
        is_completed: !!todo.is_completed,
        cover: null,
        remove_cover: false,
    });

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

        form.post(`/todos/${todo.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // setelah update, file input dikosongkan lagi
                form.setData("cover", null);
            },
        });
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Ubah Todo - {todo.title}
                        </h1>
                        <p className="text-muted-foreground">
                            Ubah data todo, termasuk cover dan status.
                        </p>
                    </div>
                    <Link href="/todos">
                        <Button variant="outline" size="sm">
                            Kembali ke Todos
                        </Button>
                    </Link>
                </div>

                <div className="max-w-3xl border rounded-lg p-6 bg-card">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Judul */}
                        <div>
                            <Label htmlFor="title">Judul</Label>
                            <Input
                                id="title"
                                value={form.data.title}
                                onChange={(e) => {
                                    form.setData("title", e.target.value);
                                    form.clearErrors("title");
                                }}
                            />
                            {form.errors.title && (
                                <p className="text-sm text-red-500 mt-1">
                                    {form.errors.title}
                                </p>
                            )}
                        </div>

                        {/* Catatan */}
                        <div>
                            <Label htmlFor="note">
                                Catatan (bisa diisi dengan Trix Editor – opsional)
                            </Label>
                            <textarea
                                id="note"
                                className="mt-1 w-full border rounded-md p-2 text-sm min-h-[80px]"
                                value={form.data.note}
                                onChange={(e) => {
                                    form.setData("note", e.target.value);
                                    form.clearErrors("note");
                                }}
                            />
                            {form.errors.note && (
                                <p className="text-sm text-red-500 mt-1">
                                    {form.errors.note}
                                </p>
                            )}
                        </div>

                        {/* Due date + status */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="due_date">
                                    Tanggal Jatuh Tempo
                                </Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    value={form.data.due_date || ""}
                                    onChange={(e) => {
                                        form.setData("due_date", e.target.value);
                                        form.clearErrors("due_date");
                                    }}
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

                        {/* Cover sekarang */}
                        <div>
                            <Label>Cover Sekarang</Label>
                            <div className="mt-2 flex items-center gap-3">
                                {todo.cover_path ? (
                                    <img
                                        src={`/storage/${todo.cover_path}`}
                                        alt={todo.title}
                                        className="w-24 h-24 object-cover rounded-md border"
                                    />
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        Belum ada cover.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Ganti cover */}
                        <div>
                            <Label htmlFor="cover">Ganti Cover (opsional)</Label>
                            <Input
                                id="cover"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0] || null;
                                    form.setData("cover", file);
                                    form.clearErrors("cover");
                                }}
                            />
                            {form.errors.cover && (
                                <p className="text-sm text-red-500 mt-1">
                                    {form.errors.cover}
                                </p>
                            )}

                            {todo.cover_path && (
                                <div className="flex items-center space-x-2 mt-2">
                                    <input
                                        id="remove_cover"
                                        type="checkbox"
                                        checked={form.data.remove_cover}
                                        onChange={(e) =>
                                            form.setData(
                                                "remove_cover",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <Label htmlFor="remove_cover">
                                        Hapus cover yang ada
                                    </Label>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-3">
                            <Button
                                type="submit"
                                disabled={form.processing}
                            >
                                Simpan Perubahan
                            </Button>
                            <Link href="/todos">
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
