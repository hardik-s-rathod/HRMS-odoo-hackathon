<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'user']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('role:admin,hr')->group(function () {
        Route::apiResource('employees', \App\Http\Controllers\EmployeeController::class);
    });

    Route::prefix('attendance')->group(function () {
        Route::post('check-in', [\App\Http\Controllers\AttendanceController::class, 'checkIn']);
        Route::post('check-out', [\App\Http\Controllers\AttendanceController::class, 'checkOut']);
        Route::get('me', [\App\Http\Controllers\AttendanceController::class, 'myAttendance']);
    });

    Route::prefix('leaves')->group(function () {
        Route::get('my', [\App\Http\Controllers\LeaveController::class, 'index']);
        Route::post('apply', [\App\Http\Controllers\LeaveController::class, 'store']);
    });

    Route::middleware('role:admin,hr')->group(function () {
        Route::get('leaves/all', [\App\Http\Controllers\LeaveController::class, 'allLeaves']);
        Route::put('leaves/{id}/status', [\App\Http\Controllers\LeaveController::class, 'updateStatus']);

        Route::get('payroll/all', [\App\Http\Controllers\PayrollController::class, 'allPayrolls']);
        Route::post('payroll/generate', [\App\Http\Controllers\PayrollController::class, 'store']);
    });

    Route::prefix('payroll')->group(function () {
        Route::get('my', [\App\Http\Controllers\PayrollController::class, 'index']);
    });
});
