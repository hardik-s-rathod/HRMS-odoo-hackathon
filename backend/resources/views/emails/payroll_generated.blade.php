<!DOCTYPE html>
<html>
<head>
    <title>Payroll Generated</title>
</head>
<body>
    <h1>Payroll Slip Generated</h1>
    <p>Your payroll for {{ $payroll->month }} {{ $payroll->year }} has been generated.</p>
    <p>Net Salary: {{ $payroll->net_salary }}</p>
    <p>Please login to your dashboard to view details.</p>
</body>
</html>
