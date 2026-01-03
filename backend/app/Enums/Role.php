<?php

namespace App\Enums;

enum Role: string
{
    case ADMIN = 'admin';
    case HR = 'hr';
    case EMPLOYEE = 'employee';
}
