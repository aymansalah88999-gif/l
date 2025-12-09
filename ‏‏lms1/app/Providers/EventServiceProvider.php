<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        // 'App\\Events\\ExampleEvent' => [
        //     'App\\Listeners\\ExampleListener',
        // ],
    ];

    public function boot(): void
    {
        parent::boot();
    }
}
