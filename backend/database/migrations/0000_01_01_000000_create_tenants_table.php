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
		Schema::create('tenants', function (Blueprint $table) {
			$table->id();
			$table->uuid('uuid')->unique();
			$table->string('name');
			$table->string('slug')->unique();
			$table->json('settings')->nullable();
			$table->json('project_default_details_schema')->nullable();
			$table->json('activity_default_details_schema')->nullable();
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('tenants');
	}
};
