<?php
/**
 * Admin Send Email API - Simplified and more robust version
 */

// Basic error handling
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set headers first
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get input
$rawInput = file_get_contents('php://input');

if (empty($rawInput)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

// Parse JSON
$data = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
    exit;
}

// Extract data
$to = $data['to'] ?? '';
$subject = $data['subject'] ?? 'Message from SAKEC ACM';
$message = $data['message'] ?? '';
$fromEmail = $data['fromEmail'] ?? 'support@sakec.acm.org';
$fromName = $data['fromName'] ?? 'SAKEC ACM Student Chapter';
$replyTo = $data['replyTo'] ?? $fromEmail;

// Validate required fields
if (empty($to)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Recipient email is required']);
    exit;
}

if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

if (empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Message is required']);
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

// Build HTML message
$htmlMessage = "<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #000; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 40px auto; background: white; border: 1px solid #ddd; }
        .header { background: #000; color: white; padding: 30px; text-align: center; }
        .header h2 { margin: 0; font-size: 20px; font-weight: 300; letter-spacing: 1px; text-transform: uppercase; }
        .content { padding: 40px; background: white; color: #333; }
        .footer { background: #f9f9f9; padding: 30px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; }
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
</html>";

// Send email
$success = @mail($to, $subject, $htmlMessage, implode("\r\n", $headers), "-f" . $fromEmail);

// Return response
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
?>
