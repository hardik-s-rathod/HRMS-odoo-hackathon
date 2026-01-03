<?php

namespace App\Repositories;

use App\Models\Leave;
use App\Repositories\Interfaces\LeaveRepositoryInterface;

class LeaveRepository extends BaseRepository implements LeaveRepositoryInterface
{
    public function __construct(Leave $model)
    {
        parent::__construct($model);
    }

    public function getForUser($userId)
    {
        return $this->model->where('user_id', $userId)->orderBy('created_at', 'desc')->get();
    }

    public function getAllPending()
    {
        return $this->model->where('status', 'pending')->with('user')->get();
    }
}
