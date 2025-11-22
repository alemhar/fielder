<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Project;
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

		$projectDetailsSchema = $tenant->project_default_details_schema ?? config('schemas.default_project_details_schema');
		$activityDetailsSchema = $tenant->activity_default_details_schema ?? config('schemas.default_activity_details_schema');

		$adminUser = User::where('email', 'admin@synnch.au')
			->where('tenant_id', $tenant->id)
			->first();
		$defaultOwnerId = $adminUser?->id;

		$chronicCareProject = Project::updateOrCreate(
			[
				'tenant_id' => $tenant->id,
				'title' => 'Chronic Care Management Program',
			],
			[
				'details_schema' => $projectDetailsSchema,
				'details' => [
					'description' => 'Long-term chronic care management for high-risk patients in the clinic.',
					'status' => 'planned',
					'startDate' => now()->toDateString(),
					'expectedCompletionDate' => null,
					'tags' => ['chronic-care', 'clinic'],
					'ownerUserId' => $defaultOwnerId ? (string) $defaultOwnerId : null,
				],
				'external_id' => null,
			]
		);

		$diabetesProject = Project::updateOrCreate(
			[
				'tenant_id' => $tenant->id,
				'title' => 'Diabetes Foot Screening Initiative',
			],
			[
				'details_schema' => $projectDetailsSchema,
				'details' => [
					'description' => 'Routine foot screening for diabetic patients to catch complications early.',
					'status' => 'planned',
					'startDate' => now()->toDateString(),
					'expectedCompletionDate' => null,
					'tags' => ['diabetes', 'screening'],
					'ownerUserId' => $defaultOwnerId ? (string) $defaultOwnerId : null,
				],
				'external_id' => null,
			]
		);

		Activity::updateOrCreate(
			[
				'tenant_id' => $tenant->id,
				'project_id' => $chronicCareProject->id,
				'title' => 'Initial patient outreach calls',
			],
			[
				'type' => 'core',
				'details_schema' => $activityDetailsSchema,
				'details' => [
					'description' => 'Call eligible high-risk patients to enroll them in the chronic care program.',
					'status' => 'todo',
					'dueDate' => now()->addWeek()->toDateString(),
					'assigneeUserId' => $defaultOwnerId ? (string) $defaultOwnerId : null,
					'estimateHours' => 4,
				],
				'external_id' => null,
			]
		);

		Activity::updateOrCreate(
			[
				'tenant_id' => $tenant->id,
				'project_id' => $chronicCareProject->id,
				'title' => 'Prepare patient education materials',
			],
			[
				'type' => 'supporting',
				'details_schema' => $activityDetailsSchema,
				'details' => [
					'description' => 'Draft and print pamphlets explaining the chronic care program.',
					'status' => 'todo',
					'dueDate' => now()->addDays(3)->toDateString(),
					'assigneeUserId' => $defaultOwnerId ? (string) $defaultOwnerId : null,
					'estimateHours' => 2,
				],
				'external_id' => null,
			]
		);

		Activity::updateOrCreate(
			[
				'tenant_id' => $tenant->id,
				'project_id' => $diabetesProject->id,
				'title' => 'Set up screening schedule',
			],
			[
				'type' => 'core',
				'details_schema' => $activityDetailsSchema,
				'details' => [
					'description' => 'Coordinate with clinicians to schedule regular foot screening slots.',
					'status' => 'todo',
					'dueDate' => now()->addWeek()->toDateString(),
					'assigneeUserId' => $defaultOwnerId ? (string) $defaultOwnerId : null,
					'estimateHours' => 3,
				],
				'external_id' => null,
			]
		);

		Activity::updateOrCreate(
			[
				'tenant_id' => $tenant->id,
				'project_id' => $diabetesProject->id,
				'title' => 'Create patient follow-up checklist',
			],
			[
				'type' => 'supporting',
				'details_schema' => $activityDetailsSchema,
				'details' => [
					'description' => 'Define a checklist for nurses to document screening findings and follow-ups.',
					'status' => 'todo',
					'dueDate' => now()->addDays(5)->toDateString(),
					'assigneeUserId' => $defaultOwnerId ? (string) $defaultOwnerId : null,
					'estimateHours' => 2,
				],
				'external_id' => null,
			]
		);
	}
}
