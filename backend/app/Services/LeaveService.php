<?php

namespace App\Services;

use App\Enums\LeaveStatus;
use App\Repositories\Interfaces\LeaveRepositoryInterface;
use Illuminate\Validation\ValidationException;

class LeaveService extends BaseService
{
    protected LeaveRepositoryInterface $leaveRepository;

    public function __construct(LeaveRepositoryInterface $leaveRepository)
    {
        $this->leaveRepository = $leaveRepository;
    }

    public function applyLeave($userId, array $data)
    {
        $data['user_id'] = $userId;
        $data['status'] = LeaveStatus::PENDING;
        return $this->leaveRepository->create($data);
    }

    public function getMyLeaves($userId)
    {
        return $this->leaveRepository->getForUser($userId);
    }

    public function getAllLeaves()
    {
        return $this->leaveRepository->all()->load('user');
    }

    public function updateStatus($leaveId, $status, $adminId, $comment = null)
    {
        $leave = $this->leaveRepository->find($leaveId);
        if (!$leave) {
            throw ValidationException::withMessages(['message' => 'Leave not found.']);
        }

        $this->leaveRepository->update($leaveId, [
            'status' => $status,
            'admin_check_by' => $adminId,
            'admin_comment' => $comment
        ]);

        $leave->refresh();
        
        \Illuminate\Support\Facades\Mail::to($leave->user->email)->send(new \App\Mail\LeaveStatusUpdated($leave));

        return $leave;
    }
}
