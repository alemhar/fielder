<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Activity extends Model
{
	use HasFactory;

	protected $fillable = [
		'uuid',
		'tenant_id',
		'project_id',
		'title',
		'type',
		'details',
		'details_schema',
		'external_id',
	];

	protected function casts(): array
	{
		return [
			'details' => 'array',
			'details_schema' => 'array',
		];
	}

	protected static function booted(): void
	{
		static::creating(function (self $activity) {
			if (empty($activity->uuid)) {
				$activity->uuid = (string) Str::uuid();
			}
		});
	}

	public function tenant()
	{
		return $this->belongsTo(Tenant::class);
	}

	public function project()
	{
		return $this->belongsTo(Project::class);
	}

	public function entries()
	{
		return $this->hasMany(ActivityEntry::class);
	}
}
