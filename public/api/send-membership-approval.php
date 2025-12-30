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
$subject = "Welcome to SAKEC ACM - Membership Approved!";
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
        .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .badge { background: #4CAF50; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; font-weight: bold; }
        .benefits { background: white; padding: 20px; border-left: 4px solid #1a1a1a; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎉 Congratulations!</h1>
            <p style='font-size: 18px; margin: 10px 0;'>Your membership has been approved!</p>
        </div>
        <div class='content'>
            <div class='badge'>✓ APPROVED</div>
            <h2>Welcome to SAKEC ACM!</h2>
            <p>Dear $name,</p>
            <p>We are thrilled to inform you that your membership application has been <strong>approved</strong>!</p>
            <p>You are now officially a member of the SAKEC ACM Student Chapter!</p>
            
            <div class='benefits'>
                <h3>Your Membership Benefits:</h3>
                <ul>
                    <li>Access to ACM Digital Library resources</li>
                    <li>Exclusive workshops and technical sessions</li>
                    <li>Networking opportunities with industry experts</li>
                    <li>Participation in hackathons and coding competitions</li>
                    <li>Official ACM membership certificate</li>
                    <li>Career guidance and mentorship</li>
                </ul>
            </div>

            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Join our WhatsApp/Telegram group (link will be shared separately)</li>
                <li>Follow us on Instagram @acm_sakec</li>
                <li>Keep an eye on upcoming events and workshops</li>
            </ul>

            <p>Welcome aboard! We're excited to have you as part of our community of tech enthusiasts and innovators.</p>
            
            <br>
            <p>Best regards,<br><strong>SAKEC ACM Admin Team</strong></p>
        </div>
        <div class='footer'>
            <p>© " . date('Y') . " SAKEC ACM Student Chapter. All rights reserved.</p>
            <p>Contact: admin@sakec.acm.org</p>
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
    echo json_encode(['success' => true, 'message' => 'Approval email sent']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send email']);
}
?>
