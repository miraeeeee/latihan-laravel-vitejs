<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('todos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('title');
            // Catatan (bisa pakai Trix editor di frontend)
            $table->text('note')->nullable();
            // Cover image (opsional, bisa diubah)
            $table->string('cover_path')->nullable();
            // Tanggal jatuh tempo (opsional)
            $table->date('due_date')->nullable();
            // Status selesai/belum
            $table->boolean('is_completed')->default(false);
            $table->timestamps();

            $table
                ->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('todos');
    }
};
