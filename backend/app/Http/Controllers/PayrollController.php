<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\Payroll\StorePayrollRequest;
use App\Services\PayrollService;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    protected PayrollService $payrollService;

    public function __construct(PayrollService $payrollService)
    {
        $this->payrollService = $payrollService;
    }

    public function index(Request $request)
    {
        return ApiResponse::success($this->payrollService->getMyPayroll($request->user()->id));
    }

    public function store(StorePayrollRequest $request)
    {
        $payroll = $this->payrollService->createPayroll($request->validated());
        return ApiResponse::success($payroll, 'Payroll generated successfully', 201);
    }

    public function allPayrolls()
    {
        return ApiResponse::success($this->payrollService->getAllPayrolls());
    }
}
