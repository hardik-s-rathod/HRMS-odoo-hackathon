<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'month',
        'year',
        'basic_salary',
        'deductions',
        'net_salary',
        'status',
    ];

    protected $casts = [
        'basic_salary' => 'decimal:2',
        'deductions' => 'decimal:2',
        'net_salary' => 'decimal:2',
        'year' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
