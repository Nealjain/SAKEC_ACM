<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

$adminEmail = 'contact@sakec.acm.org';

// Email 1: Thank you email to user
$userSubject = 'Thank you for contacting SAKEC ACM Student Chapter';
$userMessage = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .message-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Thank You for Reaching Out!</h1>
        </div>
        <div class='content'>
            <p>Dear $name,</p>
            
            <p>Thank you for contacting the SAKEC ACM Student Chapter. We have received your message and appreciate you taking the time to reach out to us.</p>
            
            <div class='message-box'>
                <p><strong>Your Message:</strong></p>
                <p><strong>Subject:</strong> $subject</p>
                <p>$message</p>
            </div>
            
            <p>Our team will review your message and get back to you within 24-48 hours. If your inquiry is urgent, please feel free to reach out to us directly at contact@sakec.acm.org.</p>
            
            <p>In the meantime, feel free to explore:</p>
            <ul>
                <li>Our upcoming events and workshops</li>
                <li>Latest blog posts and technical articles</li>
                <li>Our team and alumni network</li>
            </ul>
            
            <p>Best regards,<br>
            <strong>SAKEC ACM Student Chapter Team</strong></p>
        </div>
        <div class='footer'>
            <p>Shah & Anchor Kutchhi Engineering College<br>
            Email: contact@sakec.acm.org<br>
            © 2025 SAKEC ACM Student Chapter. All rights reserved.</p>
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
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #1a1a1a; color: white; padding: 20px; }
        .content { background: #f9f9f9; padding: 30px; }
        .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; }
        .label { font-weight: bold; color: #667eea; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🔔 New Contact Form Submission</h2>
        </div>
        <div class='content'>
            <p>You have received a new message through the SAKEC ACM website contact form.</p>
            
            <div class='info-box'>
                <p><span class='label'>Name:</span> $name</p>
                <p><span class='label'>Email:</span> <a href='mailto:$email'>$email</a></p>
                <p><span class='label'>Subject:</span> $subject</p>
            </div>
            
            <div class='info-box'>
                <p><span class='label'>Message:</span></p>
                <p>" . nl2br($message) . "</p>
            </div>
            
            <p><strong>Quick Actions:</strong></p>
            <p>
                <a href='mailto:$email?subject=Re: " . urlencode($subject) . "' style='display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;'>Reply to $name</a>
            </p>
            
            <p style='margin-top: 20px; color: #666; font-size: 12px;'>
                Received: " . date('Y-m-d H:i:s') . " IST
            </p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: SAKEC ACM <contact@sakec.acm.org>\r\n";
$headers .= "Reply-To: contact@sakec.acm.org\r\n";

// Send emails
$userEmailSent = mail($email, $userSubject, $userMessage, $headers);
$adminEmailSent = mail($adminEmail, $adminSubject, $adminMessage, $headers);

if ($userEmailSent && $adminEmailSent) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Emails sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send emails']);
}
?>
