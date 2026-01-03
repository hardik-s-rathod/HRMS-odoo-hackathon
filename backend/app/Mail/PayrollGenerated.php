<?php

namespace App\Mail;

use App\Models\Payroll;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PayrollGenerated extends Mailable
{
    use Queueable, SerializesModels;

    public $payroll;

    public function __construct(Payroll $payroll)
    {
        $this->payroll = $payroll;
    }

    public function build()
    {
        return $this->subject('Payroll Generated')
                    ->view('emails.payroll_generated');
    }
}
