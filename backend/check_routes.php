<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$routes = Illuminate\Support\Facades\Route::getRoutes();
foreach ($routes as $route) {
    echo $route->uri() . "\n";
}
