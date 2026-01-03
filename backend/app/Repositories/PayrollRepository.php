<?php

namespace App\Repositories;

use App\Models\Payroll;
use App\Repositories\Interfaces\PayrollRepositoryInterface;

class PayrollRepository extends BaseRepository implements PayrollRepositoryInterface
{
    public function __construct(Payroll $model)
    {
        parent::__construct($model);
    }

    public function getForUser($userId)
    {
        return $this->model->where('user_id', $userId)->orderBy('year', 'desc')->orderBy('month', 'desc')->get();
    }
}
