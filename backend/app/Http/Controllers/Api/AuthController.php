<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
	public function login(Request $request): JsonResponse
	{
		$credentials = $request->validate([
			'email' => ['required', 'email'],
			'password' => ['required', 'string'],
		]);

		$user = User::where('email', $credentials['email'])->first();

		if (! $user || ! Hash::check($credentials['password'], $user->password)) {
			return response()->json([
				'message' => 'Invalid credentials.',
			], 401);
		}

		$token = $user->createToken('mobile')->plainTextToken;

		$tenant = $user->tenant;
		$brandingSettings = $tenant->settings['branding'] ?? [];
		$primaryColor = $brandingSettings['primary_color'] ?? config('branding.primary_color');
		$secondaryColor = $brandingSettings['secondary_color'] ?? config('branding.secondary_color');
		$logoLightPath = $brandingSettings['logo_light_path'] ?? config('branding.logo_light');
		$logoDarkPath = $brandingSettings['logo_dark_path'] ?? config('branding.logo_dark');

		return response()->json([
			'user' => [
				'id' => (string) $user->id,
				'email' => $user->email,
				'theme_mode' => $user->theme_mode ?? 'dark',
			],
			'company' => [
				'id' => (string) $user->tenant_id,
				'name' => $tenant->name,
				'slug' => $tenant->slug,
				'branding' => [
					'primary_color' => $primaryColor,
					'secondary_color' => $secondaryColor,
					'logo_light_url' => asset($logoLightPath),
					'logo_dark_url' => asset($logoDarkPath),
				],
			],
			'token' => $token,
		]);
	}

	public function me(Request $request): JsonResponse
	{
		/** @var User $user */
		$user = $request->user();
		$tenant = $user->tenant;
		$brandingSettings = $tenant->settings['branding'] ?? [];
		$primaryColor = $brandingSettings['primary_color'] ?? config('branding.primary_color');
		$secondaryColor = $brandingSettings['secondary_color'] ?? config('branding.secondary_color');
		$logoLightPath = $brandingSettings['logo_light_path'] ?? config('branding.logo_light');
		$logoDarkPath = $brandingSettings['logo_dark_path'] ?? config('branding.logo_dark');

		return response()->json([
			'user' => [
				'id' => (string) $user->id,
				'email' => $user->email,
				'theme_mode' => $user->theme_mode ?? 'dark',
			],
			'company' => [
				'id' => (string) $user->tenant_id,
				'name' => $tenant->name,
				'slug' => $tenant->slug,
				'branding' => [
					'primary_color' => $primaryColor,
					'secondary_color' => $secondaryColor,
					'logo_light_url' => asset($logoLightPath),
					'logo_dark_url' => asset($logoDarkPath),
				],
			],
		]);
	}

	public function updateTheme(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'theme_mode' => 'required|in:light,dark',
        ]);

        /** @var User $user */
        $user = $request->user();
        $user->theme_mode = $validated['theme_mode'];
        $user->save();

        return response()->json([
            'user' => [
                'id' => (string) $user->id,
                'email' => $user->email,
                'theme_mode' => $user->theme_mode,
            ],
        ]);
    }

    public function schemas(Request $request): JsonResponse
	{
		/** @var User $user */
		$user = $request->user();
		$tenant = $user->tenant;

		$projectSchema = $tenant->project_default_details_schema ?: config('schemas.default_project_details_schema');
		$activitySchema = $tenant->activity_default_details_schema ?: config('schemas.default_activity_details_schema');

		return response()->json([
			'project_default_details_schema' => $projectSchema,
			'activity_default_details_schema' => $activitySchema,
		]);
	}
}
