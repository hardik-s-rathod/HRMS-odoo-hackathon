<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Services\AttendanceService;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    protected AttendanceService $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function checkIn(Request $request)
    {
        $attendance = $this->attendanceService->checkIn($request->user()->id);
        return ApiResponse::success($attendance, 'Checked in successfully');
    }

    public function checkOut(Request $request)
    {
        $attendance = $this->attendanceService->checkOut($request->user()->id);
        return ApiResponse::success($attendance, 'Checked out successfully');
    }

    public function myAttendance(Request $request)
    {
        $attendances = $this->attendanceService->getMyAttendance($request->user()->id);
        return ApiResponse::success($attendances);
    }

    public function allAttendance()
    {
        $attendances = $this->attendanceService->getAllAttendance();
        return ApiResponse::success($attendances);
    }
}
