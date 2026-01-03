<?php

namespace App\Repositories\Interfaces;

use App\Models\Attendance;

interface AttendanceRepositoryInterface extends BaseRepositoryInterface
{
    public function findTodayAttendance($userId);
    public function getAttendanceByDate($userId, $date);
}
