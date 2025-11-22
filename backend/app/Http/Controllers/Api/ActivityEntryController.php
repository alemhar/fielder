<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\ActivityEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ActivityEntryController extends Controller
{
	public function indexForActivity(Request $request, string $activityUuid): JsonResponse
	{
		$user = $request->user();
		$tenantId = $user->tenant_id;

		$activity = Activity::where('tenant_id', $tenantId)
			->where('uuid', $activityUuid)
			->firstOrFail();

		$entries = ActivityEntry::where('tenant_id', $tenantId)
			->where('activity_id', $activity->id)
			->with(['attachments', 'user'])
			->orderByDesc('created_at')
			->get();

		return response()->json([
			'data' => $entries->map(function (ActivityEntry $entry) {
				return [
					'uuid' => $entry->uuid,
					'body' => $entry->body,
					'data' => $entry->data,
					'created_at' => optional($entry->created_at)->toIso8601String(),
					'user' => $entry->user ? [
						'id' => (string) $entry->user->id,
						'email' => $entry->user->email,
					] : null,
					'attachments' => $entry->attachments->map(function ($attachment) {
						return [
							'uuid' => $attachment->uuid,
							'original_name' => $attachment->original_name,
							'mime_type' => $attachment->mime_type,
							'size' => $attachment->size,
							'meta' => $attachment->meta,
							'url' => Storage::disk('public')->url($attachment->file_path),
						];
					}),
				];
			}),
		]);
	}

	public function storeForActivity(Request $request, string $activityUuid): JsonResponse
	{
		$user = $request->user();
		$tenantId = $user->tenant_id;

		$activity = Activity::where('tenant_id', $tenantId)
			->where('uuid', $activityUuid)
			->firstOrFail();

		$validated = $request->validate([
			'body' => ['nullable', 'string'],
			'data' => ['nullable', 'array'],
			'attachments' => ['nullable', 'array'],
			'attachments.*' => ['file'],
		]);

		$body = $validated['body'] ?? null;
		$data = $validated['data'] ?? null;
		$attachmentsFiles = $request->file('attachments', []);

		if ($body === null && $data === null && empty($attachmentsFiles)) {
			return response()->json([
				'message' => 'Either body or data must be provided.',
			], 422);
		}

		$entry = new ActivityEntry();
		$entry->tenant_id = $tenantId;
		$entry->activity_id = $activity->id;
		$entry->user_id = $user->id;
		$entry->body = $body;
		$entry->data = $data;
		$entry->save();

		foreach ($attachmentsFiles as $uploadedFile) {
			if ($uploadedFile === null) {
				continue;
			}

			$storedPath = $uploadedFile->store(
				"tenants/{$tenantId}/activities/{$activity->id}/entries/{$entry->id}",
				'public'
			);

			$entry->attachments()->create([
				'tenant_id' => $tenantId,
				'file_path' => $storedPath,
				'original_name' => $uploadedFile->getClientOriginalName(),
				'mime_type' => $uploadedFile->getClientMimeType(),
				'size' => $uploadedFile->getSize(),
				'meta' => [],
			]);
		}

		$entry->load(['attachments', 'user']);

		return response()->json([
			'data' => [
				'uuid' => $entry->uuid,
				'body' => $entry->body,
				'data' => $entry->data,
				'created_at' => optional($entry->created_at)->toIso8601String(),
				'user' => $entry->user ? [
					'id' => (string) $entry->user->id,
					'email' => $entry->user->email,
				] : null,
				'attachments' => $entry->attachments->map(function ($attachment) {
					return [
						'uuid' => $attachment->uuid,
						'original_name' => $attachment->original_name,
						'mime_type' => $attachment->mime_type,
						'size' => $attachment->size,
						'meta' => $attachment->meta,
					];
				}),
			],
		], 201);
	}

	public function show(Request $request, string $entryUuid): JsonResponse
	{
		$user = $request->user();
		$tenantId = $user->tenant_id;

		$entry = ActivityEntry::where('tenant_id', $tenantId)
			->where('uuid', $entryUuid)
			->with(['attachments', 'user'])
			->firstOrFail();

		return response()->json([
			'data' => [
				'uuid' => $entry->uuid,
				'body' => $entry->body,
				'data' => $entry->data,
				'created_at' => optional($entry->created_at)->toIso8601String(),
				'user' => $entry->user ? [
					'id' => (string) $entry->user->id,
					'email' => $entry->user->email,
				] : null,
				'attachments' => $entry->attachments->map(function ($attachment) {
					return [
						'uuid' => $attachment->uuid,
						'original_name' => $attachment->original_name,
						'mime_type' => $attachment->mime_type,
						'size' => $attachment->size,
						'meta' => $attachment->meta,
					];
				}),
			],
		]);
	}

	public function update(Request $request, string $entryUuid): JsonResponse
	{
		$user = $request->user();
		$tenantId = $user->tenant_id;

		$entry = ActivityEntry::where('tenant_id', $tenantId)
			->where('uuid', $entryUuid)
			->firstOrFail();

		$validated = $request->validate([
			'body' => ['nullable', 'string'],
			'data' => ['nullable', 'array'],
		]);

		$entry->update([
			'body' => $validated['body'] ?? null,
			'data' => $validated['data'] ?? null,
		]);

		$entry->load(['attachments', 'user']);

		return response()->json([
			'data' => [
				'uuid' => $entry->uuid,
				'body' => $entry->body,
				'data' => $entry->data,
				'created_at' => optional($entry->created_at)->toIso8601String(),
				'user' => $entry->user ? [
					'id' => (string) $entry->user->id,
					'email' => $entry->user->email,
				] : null,
				'attachments' => $entry->attachments->map(function ($attachment) {
					return [
						'uuid' => $attachment->uuid,
						'original_name' => $attachment->original_name,
						'mime_type' => $attachment->mime_type,
						'size' => $attachment->size,
						'meta' => $attachment->meta,
					];
				}),
			],
		]);
	}

	public function deleteAttachment(Request $request, string $entryUuid, string $attachmentUuid): JsonResponse
	{
		$user = $request->user();
		$tenantId = $user->tenant_id;

		$entry = ActivityEntry::where('tenant_id', $tenantId)
			->where('uuid', $entryUuid)
			->firstOrFail();

		$attachment = $entry->attachments()
			->where('tenant_id', $tenantId)
			->where('uuid', $attachmentUuid)
			->firstOrFail();

		// Delete file from storage
		if ($attachment->file_path) {
			Storage::disk('public')->delete($attachment->file_path);
		}

		$attachment->delete();

		return response()->json(null, 204);
	}
}
