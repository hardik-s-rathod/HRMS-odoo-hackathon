<!DOCTYPE html>
<html>
<head>
    <title>Leave Status Update</title>
</head>
<body>
    <h1>Leave Status Update</h1>
    <p>Your leave request from {{ $leave->start_date }} to {{ $leave->end_date }} has been {{ $leave->status->value }}.</p>
    @if($leave->admin_comment)
        <p>Comment: {{ $leave->admin_comment }}</p>
    @endif
</body>
</html>
