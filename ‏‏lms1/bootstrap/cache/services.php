<?php return array (
  'providers' => 
  array (
    0 => 'Inertia\\ServiceProvider',
    1 => 'Laravel\\Breeze\\BreezeServiceProvider',
    2 => 'Laravel\\Pail\\PailServiceProvider',
    3 => 'Laravel\\Sail\\SailServiceProvider',
    4 => 'Laravel\\Sanctum\\SanctumServiceProvider',
    5 => 'Laravel\\Tinker\\TinkerServiceProvider',
    6 => 'Carbon\\Laravel\\ServiceProvider',
    7 => 'NunoMaduro\\Collision\\Adapters\\Laravel\\CollisionServiceProvider',
    8 => 'Termwind\\Laravel\\TermwindServiceProvider',
    9 => 'Pest\\Laravel\\PestServiceProvider',
    10 => 'Tighten\\Ziggy\\ZiggyServiceProvider',
    11 => 'App\\Providers\\AuthServiceProvider',
    12 => 'App\\Providers\\AppServiceProvider',
  ),
  'eager' => 
  array (
    0 => 'Inertia\\ServiceProvider',
    1 => 'Laravel\\Pail\\PailServiceProvider',
    2 => 'Laravel\\Sanctum\\SanctumServiceProvider',
    3 => 'Carbon\\Laravel\\ServiceProvider',
    4 => 'NunoMaduro\\Collision\\Adapters\\Laravel\\CollisionServiceProvider',
    5 => 'Termwind\\Laravel\\TermwindServiceProvider',
    6 => 'Pest\\Laravel\\PestServiceProvider',
    7 => 'Tighten\\Ziggy\\ZiggyServiceProvider',
    8 => 'App\\Providers\\AuthServiceProvider',
    9 => 'App\\Providers\\AppServiceProvider',
  ),
  'deferred' => 
  array (
    'Laravel\\Breeze\\Console\\InstallCommand' => 'Laravel\\Breeze\\BreezeServiceProvider',
    'Laravel\\Sail\\Console\\InstallCommand' => 'Laravel\\Sail\\SailServiceProvider',
    'Laravel\\Sail\\Console\\PublishCommand' => 'Laravel\\Sail\\SailServiceProvider',
    'command.tinker' => 'Laravel\\Tinker\\TinkerServiceProvider',
  ),
  'when' => 
  array (
    'Laravel\\Breeze\\BreezeServiceProvider' => 
    array (
    ),
    'Laravel\\Sail\\SailServiceProvider' => 
    array (
    ),
    'Laravel\\Tinker\\TinkerServiceProvider' => 
    array (
    ),
  ),
);