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

// Check if message is already HTML
$isHtml = (stripos($message, '<!DOCTYPE') !== false || stripos($message, '<html') !== false);

if ($isHtml) {
    // Message is already HTML, use it as-is
    $htmlMessage = $message;
} else {
    // Plain text message, wrap it in HTML
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
}

// Send
$sent = @mail($to, $subject, $htmlMessage, $headers, "-f" . $fromEmail);

// Log to Supabase (don't fail if this doesn't work)
$loggedToDb = false;
if ($sent) {
    try {
        // Supabase config
        $supabaseUrl = 'https://dhxzkzdlsszwuqjkicnv.supabase.co';
        $supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeHpremRsc3N6d3VxamtpY252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNTYyNjksImV4cCI6MjA3MDgzMjI2OX0.ofq619iAaQPW33zm_6uG6-r9UDg6tU7EF8krqZWlLOs';
        
        $emailData = [
            'recipient_email' => $to,
            'sender_email' => $fromEmail,
            'sender_name' => $fromName,
            'subject' => $subject,
            'message' => $message,
            'status' => 'sent',
            'error_message' => null
        ];
        
        $ch = curl_init($supabaseUrl . '/rest/v1/sent_emails');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($emailData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . $supabaseKey,
            'Authorization: Bearer ' . $supabaseKey,
            'Content-Type: application/json',
            'Prefer: return=representation'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        $loggedToDb = ($httpCode === 201);
    } catch (Exception $e) {
        // Ignore database errors - email was sent successfully
    }
}

// Response
if ($sent) {
    http_response_code(200);
    $response = ['success' => true, 'message' => 'Email sent successfully'];
    if (!$loggedToDb) {
        $response['warning'] = 'Email sent but not logged to database';
    }
    echo json_encode($response);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email']);
}
?>
