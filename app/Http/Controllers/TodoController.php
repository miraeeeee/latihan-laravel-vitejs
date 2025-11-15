<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TodoController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Todo::where('user_id', $user->id);

        if ($search = $request->input('q')) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        if ($status = $request->input('status')) {
            if ($status === 'completed') {
                $query->where('is_completed', true);
            } elseif ($status === 'pending') {
                $query->where('is_completed', false);
            }
        }

        $todos = $query
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        $total = Todo::where('user_id', $user->id)->count();
        $completed = Todo::where('user_id', $user->id)
            ->where('is_completed', true)
            ->count();
        $pending = $total - $completed;

        return Inertia::render('app/Todos/Index', [
            'auth' => $user,
            'todos' => $todos,
            'filters' => [
                'q' => $request->input('q'),
                'status' => $request->input('status'),
            ],
            'stats' => [
                'total' => $total,
                'completed' => $completed,
                'pending' => $pending,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'        => ['required', 'string', 'max:255'],
            'note'         => ['nullable', 'string'],
            'due_date'     => ['nullable', 'date'],
            'is_completed' => ['nullable', 'boolean'],
            'cover'        => ['nullable', 'image', 'max:2048'],
        ]);

        $user = Auth::user();

        $coverPath = null;
        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('covers', 'public');
        }

        Todo::create([
            'user_id'      => $user->id,
            'title'        => $request->input('title'),
            'note'         => $request->input('note'),
            'due_date'     => $request->input('due_date'),
            'is_completed' => (bool) $request->input('is_completed', false),
            'cover_path'   => $coverPath,
        ]);

        return redirect()
            ->route('todos.index')
            ->with('success', 'Todo berhasil ditambahkan.');
    }

    /**
     * Halaman edit (tampilan baru, data lama sudah ter-isi)
     */
    public function edit(Todo $todo)
    {
        $this->authorizeTodo($todo);

        // Kirim data todo sebagai array yang rapi ke frontend
        return Inertia::render('app/Todos/Edit', [
            'auth' => Auth::user(),
            'todo' => [
                'id'           => $todo->id,
                'title'        => $todo->title,
                'note'         => $todo->note,
                // format date ke YYYY-MM-DD supaya cocok dengan <input type="date">
                'due_date'     => $todo->due_date ? $todo->due_date->format('Y-m-d') : null,
                'is_completed' => (bool) $todo->is_completed,
                'cover_path'   => $todo->cover_path,
            ],
        ]);
    }

    public function update(Request $request, Todo $todo)
    {
        $this->authorizeTodo($todo);

        // DI UPDATE: title boleh kosong, nanti fallback ke title lama
        $request->validate([
            'title'        => ['nullable', 'string', 'max:255'],
            'note'         => ['nullable', 'string'],
            'due_date'     => ['nullable', 'date'],
            'is_completed' => ['nullable', 'boolean'],
            'cover'        => ['nullable', 'image', 'max:2048'],
            'remove_cover' => ['nullable', 'boolean'],
        ]);

        // ===== COVER =====

        // Hapus cover lama jika diminta
        if ($request->boolean('remove_cover')) {
            if ($todo->cover_path && Storage::disk('public')->exists($todo->cover_path)) {
                Storage::disk('public')->delete($todo->cover_path);
            }
            $todo->cover_path = null;
        }

        // Upload cover baru jika ada
        if ($request->hasFile('cover')) {
            if ($todo->cover_path && Storage::disk('public')->exists($todo->cover_path)) {
                Storage::disk('public')->delete($todo->cover_path);
            }

            $todo->cover_path = $request->file('cover')->store('covers', 'public');
        }

        // ===== DATA LAIN =====

        // Kalau title kosong, pakai title lama
        $title = trim((string) $request->input('title'));
        if ($title === '') {
            $title = $todo->title;
        }

        $todo->title = $title;

        // note boleh kosong (kalau form kosong, berarti user memang mau kosongkan)
        if ($request->has('note')) {
            $todo->note = $request->input('note');
        }

        // due_date: kalau dikirim kosong, set null; kalau tidak dikirim sama sekali, pakai nilai lama
        if ($request->has('due_date')) {
            $todo->due_date = $request->input('due_date') ?: null;
        }

        $todo->is_completed = (bool) $request->input('is_completed', false);

        $todo->save();

        return redirect()
            ->route('todos.index')
            ->with('success', 'Todo berhasil diupdate.');
    }

    public function destroy(Todo $todo)
    {
        $this->authorizeTodo($todo);

        if ($todo->cover_path && Storage::disk('public')->exists($todo->cover_path)) {
            Storage::disk('public')->delete($todo->cover_path);
        }

        $todo->delete();

        return redirect()
            ->route('todos.index')
            ->with('success', 'Todo berhasil dihapus.');
    }

    protected function authorizeTodo(Todo $todo): void
    {
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }
    }
}
