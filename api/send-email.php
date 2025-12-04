<?php
// Set error handling to always return JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Custom error handler to return JSON
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $errstr
    ]);
    exit;
});

// Custom exception handler
set_exception_handler(function($exception) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Exception: ' . $exception->getMessage()
    ]);
    exit;
});

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit();
}

require_once 'config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($input['name']) || !isset($input['email']) || !isset($input['subject']) || !isset($input['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit();
}

$name = htmlspecialchars($input['name']);
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars($input['subject']);
$message = htmlspecialchars($input['message']);

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit();
}

// Configuration
$systemEmail = 'contact@sakec.acm.org'; // Sender address (must be from your domain)
$adminEmail = 'neal.18191@sakec.ac.in'; // Where admin notifications go

// Email 1: Thank you email to user
$userSubject = 'Thank you for contacting SAKEC ACM Student Chapter';
$userMessage = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #000; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 40px auto; background: white; border: 1px solid #ddd; }
        .header { background: #000; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px; text-transform: uppercase; }
        .content { padding: 40px; background: white; }
        .message-box { background: #f9f9f9; padding: 20px; border: 1px solid #eee; margin: 25px 0; }
        .footer { background: #f9f9f9; padding: 30px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Thank You</h1>
        </div>
        <div class='content'>
            <p>Dear $name,</p>
            
            <p>Thank you for contacting the SAKEC ACM Student Chapter. We have received your message.</p>
            
            <div class='message-box'>
                <p style='margin-top: 0;'><strong>Your Message Details:</strong></p>
                <p><strong>Subject:</strong> $subject</p>
                <p style='margin-bottom: 0;'>$message</p>
            </div>
            
            <p>Our team will review your message and get back to you shortly.</p>
            
            <p>Best regards,<br>
            <strong>SAKEC ACM Student Chapter Team</strong></p>
        </div>
        <div class='footer'>
            <p>Shah & Anchor Kutchhi Engineering College<br>
            Email: $systemEmail<br>
            © " . date('Y') . " SAKEC ACM Student Chapter. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
";

// Email 2: Notification to admin
$adminSubject = "New Contact Form Submission from $name";
$adminMessage = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #000; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 40px auto; background: white; border: 1px solid #ddd; }
        .header { background: #000; color: white; padding: 20px; }
        .header h2 { margin: 0; font-size: 18px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 30px; background: white; }
        .info-box { background: #f9f9f9; padding: 20px; margin: 20px 0; border: 1px solid #eee; }
        .label { font-weight: bold; color: #000; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; display: inline-block; width: 80px; }
        .btn { display: inline-block; padding: 10px 20px; background: #000; color: white; text-decoration: none; border-radius: 4px; font-size: 14px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Submission</h2>
        </div>
        <div class='content'>
            <p>You have received a new message through the SAKEC ACM website contact form.</p>
            
            <div class='info-box'>
                <p><span class='label'>Name:</span> $name</p>
                <p><span class='label'>Email:</span> <a href='mailto:$email' style='color: #000;'>$email</a></p>
                <p><span class='label'>Subject:</span> $subject</p>
            </div>
            
            <div class='info-box'>
                <p><span class='label'>Message:</span></p>
                <p style='margin-top: 10px;'>" . nl2br($message) . "</p>
            </div>
            
            <p><strong>Quick Actions:</strong></p>
            <p>
                <a href='mailto:$email?subject=Re: " . urlencode($subject) . "' class='btn'>Reply to $name</a>
            </p>
            
            <p style='margin-top: 30px; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 10px;'>
                Received: " . date('Y-m-d H:i:s') . " IST
            </p>
        </div>
    </div>
</body>
</html>
";

// Email headers for user (From: System)
$userHeaders = [
    'From: SAKEC ACM <' . $systemEmail . '>',
    'Reply-To: ' . $systemEmail,
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8'
];

// Email headers for admin (From: User via System)
// Note: We send FROM system email but set Reply-To as user email
// This prevents SPF/DMARC issues while allowing easy reply
$adminHeaders = [
    'From: SAKEC ACM Website <' . $systemEmail . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8'
];

// Send emails
// Send emails with -f flag
$userEmailSent = mail($email, $userSubject, $userMessage, implode("\r\n", $userHeaders), "-f" . $systemEmail);
$adminEmailSent = mail($adminEmail, $adminSubject, $adminMessage, implode("\r\n", $adminHeaders), "-f" . $systemEmail);

// Save to Supabase contact_messages table
try {
    $contactData = [
        'name' => $name,
        'email' => $email,
        'subject' => $subject,
        'message' => $message,
        'is_read' => false
    ];
    
    // We can use the helper if we include config.php, or raw curl if not
    if (function_exists('supabaseRequest')) {
        supabaseRequest('/rest/v1/contact_messages', 'POST', $contactData);
    }
} catch (Exception $e) {
    // Ignore database errors for now, email is priority
    error_log('Database save error: ' . $e->getMessage());
}

// Always return valid JSON
if ($userEmailSent && $adminEmailSent) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Emails sent successfully']);
} elseif ($userEmailSent) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'User email sent, admin notification failed']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send emails']);
}
?>
