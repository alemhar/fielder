<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$tenant = Tenant::firstOrCreate(
			['slug' => 'synnch-au'],
			[
				'name' => 'Synnch AU',
				'settings' => [],
				'project_default_details_schema' => config('schemas.default_project_details_schema'),
				'activity_default_details_schema' => config('schemas.default_activity_details_schema'),
			]
		);

		User::updateOrCreate(
			['email' => 'admin@synnch.au'],
			[
				'tenant_id' => $tenant->id,
				'name' => 'Synnch AU Admin',
				'password' => 'password',
				'email_verified_at' => now(),
			]
		);

		User::updateOrCreate(
			['email' => 'user@synnch.au'],
			[
				'tenant_id' => $tenant->id,
				'name' => 'Synnch AU User',
				'password' => 'password',
				'email_verified_at' => now(),
			]
		);
	}
}
