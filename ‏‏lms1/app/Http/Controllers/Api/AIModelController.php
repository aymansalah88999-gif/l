<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\AiSetting;

class AIModelController extends Controller
{
    public function index()
    {
        $config = config('ai.models', []);

        // Merge DB overrides
        $result = [];
        foreach ($config as $key => $meta) {
            $override = AiSetting::getValue("model_{$key}", null);
            if (is_array($override)) {
                $meta = array_merge($meta, $override);
            }
            $result[$key] = $meta;
        }

        return response()->json(['data' => $result]);
    }

    public function update(Request $request, $key)
    {
        // Only admin can toggle models
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json(['message' => 'غير مسموح'], Response::HTTP_FORBIDDEN);
        }

        $payload = $request->validate([
            'enabled' => 'required|boolean',
        ]);

        $settingKey = "model_{$key}";
        AiSetting::setValue($settingKey, ['enabled' => (bool) $payload['enabled']]);

        return response()->json(['message' => 'تم التحديث بنجاح', 'data' => ['key' => $key, 'enabled' => (bool) $payload['enabled']]]);
    }
}
