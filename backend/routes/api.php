<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\ActivityEntryController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
Route::middleware('auth:sanctum')->get('/tenant/schemas', [AuthController::class, 'schemas']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{projectUuid}', [ProjectController::class, 'show']);

    Route::get('/projects/{projectUuid}/activities', [ActivityController::class, 'indexForProject']);
    Route::get('/activities/{activityUuid}', [ActivityController::class, 'show']);

    Route::get('/activities/{activityUuid}/entries', [ActivityEntryController::class, 'indexForActivity']);
    Route::post('/activities/{activityUuid}/entries', [ActivityEntryController::class, 'storeForActivity']);
});
