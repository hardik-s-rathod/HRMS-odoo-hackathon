<?php

namespace App\Http\Requests\Payroll;

use Illuminate\Foundation\Http\FormRequest;

class StorePayrollRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'month' => ['required', 'string'],
            'year' => ['required', 'integer', 'min:2000', 'max:' . (date('Y') + 1)],
            'basic_salary' => ['required', 'numeric', 'min:0'],
            'deductions' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
