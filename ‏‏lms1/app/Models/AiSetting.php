<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiSetting extends Model
{
    protected $table = 'ai_settings';

    protected $fillable = ['key','value'];

    protected $casts = [
        'value' => 'array',
    ];

    public static function getValue(string $key, $default = null)
    {
        $rec = static::where('key', $key)->first();
        return $rec ? $rec->value : $default;
    }

    public static function setValue(string $key, $value): self
    {
        return static::updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
