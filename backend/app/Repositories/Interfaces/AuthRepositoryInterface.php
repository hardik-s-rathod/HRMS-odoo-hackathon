<?php

namespace App\Repositories\Interfaces;

use App\Models\User;

interface AuthRepositoryInterface extends BaseRepositoryInterface
{
    public function findByEmail(string $email): ?User;
}
