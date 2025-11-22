<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\ActivityEntryController;
use App\Http\Controllers\Api\SpeechToTextController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/theme', [AuthController::class, 'updateTheme']);
    Route::get('/schemas', [AuthController::class, 'schemas']);
    Route::post('/speech-to-text', [SpeechToTextController::class, 'transcribe']);

    // Temporary debug route
    Route::post('/debug-upload', function (\Illuminate\Http\Request $request) {
        $allFiles = $request->allFiles();
        $attachments = $allFiles['attachments'] ?? [];
        
        // Handle both single file and array of files
        if (isset($attachments['name'])) {
            // Single file
            $attachments = [$attachments];
        } elseif (!is_array($attachments)) {
            $attachments = [];
        }
        
        $fileInfo = [];
        foreach ($attachments as $index => $file) {
            if (is_array($file)) {
                $fileInfo["attachments.$index"] = [
                    'isArray' => true,
                    'keys' => array_keys($file),
                    'name' => $file['name'] ?? 'missing',
                    'type' => $file['type'] ?? 'missing',
                    'uri' => $file['uri'] ?? 'missing',
                ];
            } elseif ($file instanceof \Illuminate\Http\UploadedFile) {
                try {
                    $fileInfo["attachments.$index"] = [
                        'isUploadedFile' => true,
                        'originalName' => $file->getClientOriginalName(),
                        'mimeType' => $file->getMimeType(),
                        'size' => $file->getSize(),
                        'error' => $file->getError(),
                        'isValid' => $file->isValid(),
                        'path' => $file->getPath(),
                    ];
                } catch (\Exception $e) {
                    $fileInfo["attachments.$index"] = [
                        'isUploadedFile' => true,
                        'error' => $e->getMessage(),
                        'originalName' => method_exists($file, 'getClientOriginalName') ? $file->getClientOriginalName() : 'N/A',
                    ];
                }
            }
        }
        
        return response()->json([
            'hasFile' => $request->hasFile('attachments'),
            'allFilesStructure' => array_keys($allFiles),
            'attachmentsType' => gettype($allFiles['attachments'] ?? null),
            'attachments' => $fileInfo,
            'input' => $request->input(),
            'headers' => collect($request->headers->all())->only(['content-type', 'content-length'])->toArray(),
        ]);
    });

    // Camera photo upload endpoint (accepts base64)
    Route::post('/activities/{activityUuid}/entries/camera', [ActivityEntryController::class, 'storeFromCamera']);

    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{projectUuid}', [ProjectController::class, 'show']);

    Route::get('/projects/{projectUuid}/activities', [ActivityController::class, 'indexForProject']);
    Route::get('/activities/{activityUuid}', [ActivityController::class, 'show']);

    Route::get('/activities/{activityUuid}/entries', [ActivityEntryController::class, 'indexForActivity']);
    Route::post('/activities/{activityUuid}/entries', [ActivityEntryController::class, 'storeForActivity']);
    Route::get('/entries/{entryUuid}', [ActivityEntryController::class, 'show']);
    Route::put('/entries/{entryUuid}', [ActivityEntryController::class, 'update']);
    Route::delete('/entries/{entryUuid}/attachments/{attachmentUuid}', [ActivityEntryController::class, 'deleteAttachment']);
});
