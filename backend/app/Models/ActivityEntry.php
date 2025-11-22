<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ActivityEntry extends Model
{
	use HasFactory;

	protected $fillable = [
		'uuid',
		'tenant_id',
		'activity_id',
		'user_id',
		'body',
		'data',
	];

	protected function casts(): array
	{
		return [
			'data' => 'array',
		];
	}

	protected static function booted(): void
	{
		static::creating(function (self $entry) {
			if (empty($entry->uuid)) {
				$entry->uuid = (string) Str::uuid();
			}
		});
	}

	public function tenant()
	{
		return $this->belongsTo(Tenant::class);
	}

	public function activity()
	{
		return $this->belongsTo(Activity::class);
	}

	public function attachments()
	{
		return $this->hasMany(ActivityEntryAttachment::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
