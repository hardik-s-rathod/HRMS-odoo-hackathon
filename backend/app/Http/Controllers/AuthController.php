<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());
        return ApiResponse::success($result, 'User registered successfully', 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated());
        return ApiResponse::success($result, 'Login successful');
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());
        return ApiResponse::success([], 'Logged out successfully');
    }

    public function user(Request $request): JsonResponse
    {
        return ApiResponse::success($request->user()->load('employee'));
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'phone_number' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        if (isset($data['phone_number'])) {
            $user->update(['phone_number' => $data['phone_number']]);
        }

        if (isset($data['address']) && $user->employee) {
            $user->employee->update(['address' => $data['address']]);
        }

        return ApiResponse::success($user->load('employee'), 'Profile updated successfully');
    }
}
