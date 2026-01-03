<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\Interfaces\AuthRepositoryInterface::class,
            \App\Repositories\AuthRepository::class
        );
        $this->app->bind(
            \App\Repositories\Interfaces\EmployeeRepositoryInterface::class,
            \App\Repositories\EmployeeRepository::class
        );
        $this->app->bind(
            \App\Repositories\Interfaces\AttendanceRepositoryInterface::class,
            \App\Repositories\AttendanceRepository::class
        );
        $this->app->bind(
            \App\Repositories\Interfaces\LeaveRepositoryInterface::class,
            \App\Repositories\LeaveRepository::class
        );
        $this->app->bind(
            \App\Repositories\Interfaces\PayrollRepositoryInterface::class,
            \App\Repositories\PayrollRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
