<?php

namespace App\Services;

use App\Enums\Role;
use App\Models\User;
use App\Repositories\Interfaces\EmployeeRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EmployeeService extends BaseService
{
    protected EmployeeRepositoryInterface $employeeRepository;

    public function __construct(EmployeeRepositoryInterface $employeeRepository)
    {
        $this->employeeRepository = $employeeRepository;
    }

    public function getAllEmployees()
    {
        return $this->employeeRepository->all()->load('user');
    }

    public function createEmployee(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Create User
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => Role::EMPLOYEE, // Default to employee, unless specified?
            ]);

            // Create Employee Details
            $employeeData = [
                'user_id' => $user->id,
                'designation' => $data['designation'] ?? null,
                'department' => $data['department'] ?? null,
                'joining_date' => $data['joining_date'] ?? null,
                'salary' => $data['salary'] ?? 0,
                'address' => $data['address'] ?? null,
            ];

            return $this->employeeRepository->create($employeeData);
        });
    }

    public function updateEmployee($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $employee = $this->employeeRepository->find($id);
            if (!$employee) return null;

            // Update User
            if (isset($data['name']) || isset($data['email'])) {
                $employee->user->update([
                    'name' => $data['name'] ?? $employee->user->name,
                    'email' => $data['email'] ?? $employee->user->email,
                ]);
            }

            // Update Employee Details
            $this->employeeRepository->update($id, $data);

            return $employee->refresh();
        });
    }

    public function deleteEmployee($id)
    {
        return DB::transaction(function () use ($id) {
            $employee = $this->employeeRepository->find($id);
            if (!$employee) return false;

            $employee->user->delete(); // Soft delete user
            $this->employeeRepository->delete($id); // Soft delete employee details

            return true;
        });
    }
}
