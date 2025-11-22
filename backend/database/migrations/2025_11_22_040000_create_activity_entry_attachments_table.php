<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::create('activity_entry_attachments', function (Blueprint $table) {
			$table->id();
			$table->uuid('uuid')->unique();
			$table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
			$table->foreignId('activity_entry_id')->constrained('activity_entries')->cascadeOnDelete();
			$table->string('file_path');
			$table->string('original_name')->nullable();
			$table->string('mime_type')->nullable();
			$table->unsignedBigInteger('size')->nullable();
			$table->json('meta')->nullable();
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('activity_entry_attachments');
	}
};
