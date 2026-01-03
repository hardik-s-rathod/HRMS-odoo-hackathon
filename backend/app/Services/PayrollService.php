<?php

namespace App\Services;

use App\Repositories\Interfaces\PayrollRepositoryInterface;
use Illuminate\Validation\ValidationException;

class PayrollService extends BaseService
{
    protected PayrollRepositoryInterface $payrollRepository;

    public function __construct(PayrollRepositoryInterface $payrollRepository)
    {
        $this->payrollRepository = $payrollRepository;
    }

    public function createPayroll(array $data)
    {
        // Calculate net salary
        $basic = $data['basic_salary'];
        $deductions = $data['deductions'] ?? 0;
        $net = $basic - $deductions;

        $data['net_salary'] = $net;
        $data['status'] = 'generated';

        $payroll = $this->payrollRepository->create($data);

        // Fetch user to get email
        $payroll->load('user');
        if($payroll->user) {
            \Illuminate\Support\Facades\Mail::to($payroll->user->email)->send(new \App\Mail\PayrollGenerated($payroll));
        }

        return $payroll;
    }

    public function getMyPayroll($userId)
    {
        return $this->payrollRepository->getForUser($userId);
    }

    public function getAllPayrolls()
    {
        return $this->payrollRepository->all()->load('user');
    }
}
