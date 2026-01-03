<?php

namespace App\Repositories\Interfaces;

interface PayrollRepositoryInterface extends BaseRepositoryInterface
{
    public function getForUser($userId);
}
