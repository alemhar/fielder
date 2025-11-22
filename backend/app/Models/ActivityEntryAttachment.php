<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ActivityEntryAttachment extends Model
{
	use HasFactory;

	protected $fillable = [
		'uuid',
		'tenant_id',
		'activity_entry_id',
		'file_path',
		'original_name',
		'mime_type',
		'size',
		'meta',
	];

	protected function casts(): array
	{
		return [
			'meta' => 'array',
		];
	}

	protected static function booted(): void
	{
		static::creating(function (self $attachment) {
			if (empty($attachment->uuid)) {
				$attachment->uuid = (string) Str::uuid();
			}
		});
	}

	public function tenant()
	{
		return $this->belongsTo(Tenant::class);
	}

	public function entry()
	{
		return $this->belongsTo(ActivityEntry::class, 'activity_entry_id');
	}
}
