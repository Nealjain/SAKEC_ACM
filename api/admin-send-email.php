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
    if (empty($to)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing required field: recipient email (to) is required'
        ]);
        exit;
    }

    // Use defaults if missing
    if (empty($subject)) {
        $subject = 'Message from SAKEC ACM';
    }
    
    if (empty($message)) {
        $message = 'This is an automated message from SAKEC ACM Student Chapter.';
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
    
    // Send email with -f flag to set envelope sender
    $success = mail($to, $subject, $htmlMessage, implode("\r\n", $headers), "-f" . $fromEmail);
    
    // Save to Supabase sent_emails table (optional - don't block on failure)
    $supabaseError = null;
    if (function_exists('supabaseRequest')) {
        try {
            $emailData = [
                'recipient_email' => $to,
                'sender_email' => $fromEmail,
                'sender_name' => $fromName,
                'subject' => $subject,
                'message' => $message,
                'status' => $success ? 'sent' : 'failed',
                'error_message' => $success ? null : 'Mail function returned false'
            ];
            
            $result = supabaseRequest('/rest/v1/sent_emails', 'POST', $emailData);
            
            if ($result['status'] !== 201) {
                $supabaseError = 'Supabase status: ' . $result['status'];
                error_log('Failed to save email to Supabase: ' . print_r($result, true));
                // Continue anyway - email was sent
            }
        } catch (Exception $e) {
            $supabaseError = $e->getMessage();
            error_log('Supabase save error: ' . $e->getMessage());
            // Don't fail the request if Supabase save fails - email was still sent
        }
    }
    
    // Always return valid JSON
    if ($success) {
        http_response_code(200);
        $response = [
            'success' => true,
            'message' => 'Email sent successfully'
        ];
        if ($supabaseError) {
            $response['warning'] = 'Email sent but not logged to database: ' . $supabaseError;
        }
        echo json_encode($response);
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
