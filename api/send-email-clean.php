<?php
/**
 * Clean Email Sending API - No error handlers that could cause issues
 */

// Basic settings
error_reporting(0); // Suppress all errors
ini_set('display_errors', '0');

// Headers
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    die(json_encode(['success' => true]));
}

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['success' => false, 'message' => 'Method not allowed']));
}

// Get input
$input = @file_get_contents('php://input');
if (!$input) {
    http_response_code(400);
    die(json_encode(['success' => false, 'message' => 'No data received']));
}

// Parse JSON
$data = @json_decode($input, true);
if (!$data) {
    http_response_code(400);
    die(json_encode(['success' => false, 'message' => 'Invalid JSON']));
}

// Get fields
$to = isset($data['to']) ? trim($data['to']) : '';
$subject = isset($data['subject']) ? trim($data['subject']) : 'Message from SAKEC ACM';
$message = isset($data['message']) ? $data['message'] : '';
$fromEmail = isset($data['fromEmail']) ? trim($data['fromEmail']) : 'support@sakec.acm.org';
$fromName = isset($data['fromName']) ? $data['fromName'] : 'SAKEC ACM Student Chapter';
$replyTo = isset($data['replyTo']) ? trim($data['replyTo']) : $fromEmail;

// Validate
if (empty($to) || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die(json_encode(['success' => false, 'message' => 'Invalid recipient email']));
}

if (empty($message)) {
    http_response_code(400);
    die(json_encode(['success' => false, 'message' => 'Message is required']));
}

// Build email
$headers = "From: " . $fromName . " <" . $fromEmail . ">\r\n";
$headers .= "Reply-To: " . $replyTo . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$htmlMessage = '<!DOCTYPE html>
<html>
<head>
<style>
body{font-family:Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:20px;background:#f4f4f4}
.container{max-width:600px;margin:0 auto;background:#fff;padding:30px;border:1px solid #ddd}
.header{background:#000;color:#fff;padding:20px;text-align:center;margin:-30px -30px 20px}
.footer{margin-top:20px;padding-top:20px;border-top:1px solid #eee;color:#888;font-size:12px;text-align:center}
</style>
</head>
<body>
<div class="container">
<div class="header"><h2 style="margin:0">' . htmlspecialchars($fromName) . '</h2></div>
<div>' . nl2br(htmlspecialchars($message)) . '</div>
<div class="footer">
<p>© ' . date('Y') . ' SAKEC ACM Student Chapter</p>
</div>
</div>
</body>
</html>';

// Send
$sent = @mail($to, $subject, $htmlMessage, $headers, "-f" . $fromEmail);

// Response
if ($sent) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email']);
}
?>
