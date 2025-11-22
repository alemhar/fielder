<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tenant extends Model
{
	use HasFactory;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var list<string>
	 */
	protected $fillable = [
		'uuid',
		'name',
		'slug',
		'settings',
		'project_default_details_schema',
		'activity_default_details_schema',
	];

	/**
	 * The attributes that should be cast.
	 *
	 * @return array<string, string>
	 */
	protected function casts(): array
	{
		return [
			'settings' => 'array',
			'project_default_details_schema' => 'array',
			'activity_default_details_schema' => 'array',
		];
	}

	protected static function booted(): void
	{
		static::creating(function (self $tenant) {
			if (empty($tenant->uuid)) {
				$tenant->uuid = (string) Str::uuid();
			}

			if (empty($tenant->project_default_details_schema)) {
				$tenant->project_default_details_schema = config('schemas.default_project_details_schema');
			}

			if (empty($tenant->activity_default_details_schema)) {
				$tenant->activity_default_details_schema = config('schemas.default_activity_details_schema');
			}
		});
	}

	public function getRouteKeyName(): string
	{
		return 'uuid';
	}

	public function users()
	{
		return $this->hasMany(User::class);
	}
}
