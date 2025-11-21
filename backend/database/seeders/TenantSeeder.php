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
