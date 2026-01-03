<?php

namespace App\Repositories\Interfaces;

interface LeaveRepositoryInterface extends BaseRepositoryInterface
{
    public function getForUser($userId);
    public function getAllPending();
}
