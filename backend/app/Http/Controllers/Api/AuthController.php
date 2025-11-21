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

		return response()->json([
			'user' => [
				'id' => (string) $user->id,
				'email' => $user->email,
			],
			'company' => [
				'id' => (string) $user->tenant_id,
				'name' => $user->tenant->name,
				'slug' => $user->tenant->slug,
			],
			'token' => $token,
		]);
	}

	public function me(Request $request): JsonResponse
	{
		/** @var User $user */
		$user = $request->user();

		return response()->json([
			'user' => [
				'id' => (string) $user->id,
				'email' => $user->email,
			],
			'company' => [
				'id' => (string) $user->tenant_id,
				'name' => $user->tenant->name,
				'slug' => $user->tenant->slug,
			],
		]);
	}
}
