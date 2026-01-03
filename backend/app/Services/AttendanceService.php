<?php

namespace App\Services;

use App\Enums\AttendanceStatus;
use App\Repositories\Interfaces\AttendanceRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class AttendanceService extends BaseService
{
    protected AttendanceRepositoryInterface $attendanceRepository;

    public function __construct(AttendanceRepositoryInterface $attendanceRepository)
    {
        $this->attendanceRepository = $attendanceRepository;
    }

    public function checkIn($userId)
    {
        $todayAttendance = $this->attendanceRepository->findTodayAttendance($userId);

        if ($todayAttendance) {
            throw ValidationException::withMessages(['message' => 'Already checked in today.']);
        }

        return $this->attendanceRepository->create([
            'user_id' => $userId,
            'date' => Carbon::today(),
            'check_in' => Carbon::now()->format('H:i:s'),
            'status' => AttendanceStatus::PRESENT,
        ]);
    }

    public function checkOut($userId)
    {
        $attendance = $this->attendanceRepository->findTodayAttendance($userId);

        if (!$attendance) {
            throw ValidationException::withMessages(['message' => 'Not checked in today.']);
        }

        if ($attendance->check_out) {
            throw ValidationException::withMessages(['message' => 'Already checked out today.']);
        }

        $checkOutTime = Carbon::now();
        $checkInTime = Carbon::createFromFormat('H:i:s', $attendance->check_in);
        
        // Fix for date parsing if check_in is just time string, use today's date
        $checkInTime->setDate($checkOutTime->year, $checkOutTime->month, $checkOutTime->day);

        $totalHours = $checkOutTime->diffInHours($checkInTime); // Simple hours calc

        $this->attendanceRepository->update($attendance->id, [
            'check_out' => $checkOutTime->format('H:i:s'),
            'total_hours' => number_format($totalHours, 2),
        ]);

        return $attendance->refresh();
    }

    public function getMyAttendance($userId)
    {
        // Return simplified list or paginated
        return \App\Models\Attendance::where('user_id', $userId)->orderBy('date', 'desc')->get();
    }
}
