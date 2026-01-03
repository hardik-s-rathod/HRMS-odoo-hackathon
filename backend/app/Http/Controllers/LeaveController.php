<?php

namespace App\Http\Controllers;

use App\Enums\LeaveStatus;
use App\Helpers\ApiResponse;
use App\Http\Requests\Leave\StoreLeaveRequest;
use App\Services\LeaveService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class LeaveController extends Controller
{
    protected LeaveService $leaveService;

    public function __construct(LeaveService $leaveService)
    {
        $this->leaveService = $leaveService;
    }

    public function index(Request $request)
    {
        // If admin/hr return all, else return own?
        // Let's separate into 'my-leaves' and 'all-leaves' (admin)
        return ApiResponse::success($this->leaveService->getMyLeaves($request->user()->id));
    }

    public function store(StoreLeaveRequest $request)
    {
        $leave = $this->leaveService->applyLeave($request->user()->id, $request->validated());
        return ApiResponse::success($leave, 'Leave applied successfully', 201);
    }

    public function allLeaves()
    {
        // Admin only
        return ApiResponse::success($this->leaveService->getAllLeaves());
    }

    public function updateStatus(Request $request, $id)
    {
        // Admin only
        $request->validate([
            'status' => ['required', new Enum(LeaveStatus::class)],
            'comment' => ['nullable', 'string']
        ]);

        $leave = $this->leaveService->updateStatus(
            $id,
            $request->status,
            $request->user()->id,
            $request->comment
        );

        return ApiResponse::success($leave, 'Leave status updated');
    }
}
