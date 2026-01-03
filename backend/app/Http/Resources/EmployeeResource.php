<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'role' => $this->user->role,
                'is_active' => $this->user->is_active,
            ],
            'designation' => $this->designation,
            'department' => $this->department,
            'joining_date' => $this->joining_date,
            'salary' => $this->salary,
            'address' => $this->address,
            'created_at' => $this->created_at,
        ];
    }
}
