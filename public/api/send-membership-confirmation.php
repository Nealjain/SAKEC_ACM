<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';

if (empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name and email are required']);
    exit();
}

// Email configuration
$to = $email;
$subject = "Thank You for Joining SAKEC ACM!";
$from = "admin@sakec.acm.org";
$fromName = "SAKEC ACM Admin";

// Email HTML content
$htmlMessage = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #1a1a1a; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>SAKEC ACM Student Chapter</h1>
        </div>
        <div class='content'>
            <h2>Thank You for Your Interest!</h2>
            <p>Dear $name,</p>
            <p>Thank you for showing interest in joining the SAKEC ACM Student Chapter!</p>
            <p>Your membership application has been successfully received and is currently being processed by our team.</p>
            <p><strong>What happens next?</strong></p>
            <ul>
                <li>Our admin team will review your application</li>
                <li>You'll receive a confirmation email once approved</li>
                <li>This usually takes 1-2 business days</li>
            </ul>
            <p>We're excited to have you join our community of tech enthusiasts and innovators!</p>
            <p>If you have any questions, feel free to reply to this email.</p>
            <br>
            <p>Best regards,<br><strong>SAKEC ACM Admin Team</strong></p>
        </div>
        <div class='footer'>
            <p>© " . date('Y') . " SAKEC ACM Student Chapter. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
";

// Headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: $fromName <$from>\r\n";
$headers .= "Reply-To: $from\r\n";

// Send email
$mailSent = mail($to, $subject, $htmlMessage, $headers);

if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Confirmation email sent']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send email']);
}
?>
