<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit(0);
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get raw input
    $rawInput = file_get_contents('php://input');
    
    // Check if input is empty
    if (empty($rawInput)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'No data received'
        ]);
        exit;
    }
    
    // Decode JSON
    $data = json_decode($rawInput, true);
    
    // Check for JSON errors
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid JSON: ' . json_last_error_msg()
        ]);
        exit;
    }
    
    $to = $data['to'] ?? '';
    $subject = $data['subject'] ?? '';
    $message = $data['message'] ?? '';
    $replyTo = $data['replyTo'] ?? CONTACT_EMAIL;
    $fromEmail = $data['fromEmail'] ?? CONTACT_EMAIL;
    $fromName = $data['fromName'] ?? 'SAKEC ACM Student Chapter';
    
    // Validate required fields
    if (empty($to) || empty($subject) || empty($message)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields: to, subject, and message are required'
        ]);
        exit;
    }
    
    // Validate email format
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid recipient email address'
        ]);
        exit;
    }
    
    // Build headers
    $headers = [
        'From: ' . $fromName . ' <' . $fromEmail . '>',
        'Reply-To: ' . $replyTo,
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8'
    ];
    
    // Build HTML email
    $htmlMessage = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #000; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 40px auto; background: white; border: 1px solid #ddd; }
            .header { background: #000; color: white; padding: 30px; text-align: center; }
            .header h2 { margin: 0; font-size: 20px; font-weight: 300; letter-spacing: 1px; text-transform: uppercase; }
            .content { padding: 40px; background: white; color: #333; }
            .footer { background: #f9f9f9; padding: 30px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; }
            @media only screen and (max-width: 600px) {
                .container { margin: 0; border: none; }
                .content { padding: 20px; }
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>" . htmlspecialchars($fromName) . "</h2>
            </div>
            <div class='content'>
                " . nl2br(htmlspecialchars($message)) . "
            </div>
            <div class='footer'>
                <p>This email was sent from " . htmlspecialchars($fromName) . ".</p>
                <p>© " . date('Y') . " SAKEC ACM. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Send email
    $success = mail($to, $subject, $htmlMessage, implode("\r\n", $headers));
    
    // Always return valid JSON
    if ($success) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Email sent successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to send email. Please check server mail configuration.'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
}
?>
