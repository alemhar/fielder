<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
	public function indexForProject(Request $request, string $projectUuid): JsonResponse
	{
		$user = $request->user();
		$tenantId = $user->tenant_id;

		$project = Project::where('tenant_id', $tenantId)
			->where('uuid', $projectUuid)
			->firstOrFail();

		$activities = $project->activities()
			->where('tenant_id', $tenantId)
			->orderBy('title')
			->get();

		return response()->json([
			'data' => $activities->map(function (Activity $activity) {
				return [
					'uuid' => $activity->uuid,
					'title' => $activity->title,
					'type' => $activity->type,
					'details' => $activity->details,
					'details_schema' => $activity->details_schema,
					'external_id' => $activity->external_id,
				];
			}),
		]);
	}

	public function show(Request $request, string $activityUuid): JsonResponse
	{
		$user = $request->user();
		$tenantId = $user->tenant_id;

		$activity = Activity::where('tenant_id', $tenantId)
			->where('uuid', $activityUuid)
			->with(['project' => function ($query) use ($tenantId) {
				$query->where('tenant_id', $tenantId);
			}])
			->withCount('entries')
			->firstOrFail();

		return response()->json([
			'data' => [
				'uuid' => $activity->uuid,
				'title' => $activity->title,
				'type' => $activity->type,
				'details' => $activity->details,
				'details_schema' => $activity->details_schema,
				'external_id' => $activity->external_id,
				'entries_count' => $activity->entries_count,
				'project' => $activity->project ? [
					'uuid' => $activity->project->uuid,
					'title' => $activity->project->title,
				] : null,
			],
		]);
	}
}
