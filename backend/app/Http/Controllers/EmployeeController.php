<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Services\EmployeeService;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    protected EmployeeService $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    public function index()
    {
        $employees = $this->employeeService->getAllEmployees();
        return ApiResponse::success(EmployeeResource::collection($employees));
    }

    public function store(StoreEmployeeRequest $request)
    {
        $employee = $this->employeeService->createEmployee($request->validated());
        return ApiResponse::success(new EmployeeResource($employee), 'Employee created successfully', 201);
    }

    public function show($id)
    {
        // ...
    }

    public function update(Request $request, $id)
    {
        $employee = $this->employeeService->updateEmployee($id, $request->all());
        if (!$employee) return ApiResponse::error('Employee not found', 404);
        return ApiResponse::success(new EmployeeResource($employee), 'Employee updated successfully');
    }

    public function destroy($id)
    {
        $result = $this->employeeService->deleteEmployee($id);
        if (!$result) return ApiResponse::error('Employee not found', 404);
        return ApiResponse::success([], 'Employee deleted successfully');
    }
}
