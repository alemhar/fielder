<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
	public function index(Request $request): JsonResponse
	{
		$user = $request->user();
		$tenantId = $user->tenant_id;

		$projects = Project::where('tenant_id', $tenantId)
			->withCount('activities')
			->orderBy('title')
			->get();

		return response()->json([
			'data' => $projects->map(function (Project $project) {
				return [
					'uuid' => $project->uuid,
					'title' => $project->title,
					'details' => $project->details,
					'details_schema' => $project->details_schema,
					'external_id' => $project->external_id,
					'activities_count' => $project->activities_count,
				];
			}),
		]);
	}

	public function show(Request $request, string $projectUuid): JsonResponse
	{
		$user = $request->user();
		$tenantId = $user->tenant_id;

		$project = Project::where('tenant_id', $tenantId)
			->where('uuid', $projectUuid)
			->withCount('activities')
			->with(['activities' => function ($query) use ($tenantId) {
				$query->where('tenant_id', $tenantId)
					->orderBy('title');
			}])
			->firstOrFail();

		return response()->json([
			'data' => [
				'uuid' => $project->uuid,
				'title' => $project->title,
				'details' => $project->details,
				'details_schema' => $project->details_schema,
				'external_id' => $project->external_id,
				'activities_count' => $project->activities_count,
				'activities' => $project->activities->map(function ($activity) {
					return [
						'uuid' => $activity->uuid,
						'title' => $activity->title,
						'type' => $activity->type,
						'external_id' => $activity->external_id,
					];
				}),
			],
		]);
	}
}
