<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
	use HasFactory;

	protected $fillable = [
		'uuid',
		'tenant_id',
		'title',
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
		static::creating(function (self $project) {
			if (empty($project->uuid)) {
				$project->uuid = (string) Str::uuid();
			}
		});
	}

	public function tenant()
	{
		return $this->belongsTo(Tenant::class);
	}

	public function activities()
	{
		return $this->hasMany(Activity::class);
	}
}
