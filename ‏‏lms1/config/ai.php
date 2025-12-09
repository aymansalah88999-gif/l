<?php

return [
    // Default AI models available in the system. Each entry can be overridden
    // at runtime by admin via the `ai_settings` table.
    'models' => [
        'claude_haiku_4_5' => [
            'name' => 'Claude Haiku 4.5',
            'enabled' => true,
            'description' => 'Haiku-optimized Claude model (read-only flag managed by admin).'
        ],
    ],
];
