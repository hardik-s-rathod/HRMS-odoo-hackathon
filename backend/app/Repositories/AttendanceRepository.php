<?php

namespace App\Repositories;

use App\Models\Attendance;
use App\Repositories\Interfaces\AttendanceRepositoryInterface;
use Carbon\Carbon;

class AttendanceRepository extends BaseRepository implements AttendanceRepositoryInterface
{
    public function __construct(Attendance $model)
    {
        parent::__construct($model);
    }

    public function findTodayAttendance($userId)
    {
        return $this->model->where('user_id', $userId)
            ->where('date', Carbon::today())
            ->first();
    }

    public function getAttendanceByDate($userId, $date)
    {
        return $this->model->where('user_id', $userId)
            ->where('date', $date)
            ->first();
    }
}
