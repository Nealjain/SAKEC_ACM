<?php
/**
 * Debug Email API - Shows detailed error information
 */

// Enable error display for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit(0);
}

// Log everything
$logData = [
    'timestamp' => date('Y-m-d H:i:s'),
    'method' => $_SERVER['REQUEST_METHOD'],
    'headers' => getallheaders(),
    'raw_input' => file_get_contents('php://input'),
    'php_version' => phpversion(),
    'mail_function_exists' => function_exists('mail'),
];

// Try to include config
try {
    require_once 'config.php';
    $logData['config_loaded'] = true;
} catch (Exception $e) {
    $logData['config_error'] = $e->getMessage();
    echo json_encode([
        'success' => false,
        'error' => 'Config load failed: ' . $e->getMessage(),
        'debug' => $logData
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    
    if (empty($rawInput)) {
        echo json_encode([
            'success' => false,
            'error' => 'No data received',
            'debug' => $logData
        ]);
        exit;
    }
    
    $data = json_decode($rawInput, true);
    $logData['parsed_data'] = $data;
    $logData['json_error'] = json_last_error_msg();
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON: ' . json_last_error_msg(),
            'debug' => $logData
        ]);
        exit;
    }
    
    $to = $data['to'] ?? '';
    $subject = $data['subject'] ?? '';
    $message = $data['message'] ?? '';
    $fromEmail = $data['fromEmail'] ?? 'support@sakec.acm.org';
    $fromName = $data['fromName'] ?? 'SAKEC ACM Student Chapter';
    $replyTo = $data['replyTo'] ?? 'support@sakec.acm.org';
    
    $logData['email_params'] = [
        'to' => $to,
        'subject' => $subject,
        'message_length' => strlen($message),
        'fromEmail' => $fromEmail,
        'fromName' => $fromName,
        'replyTo' => $replyTo
    ];
    
    // Validate
    if (empty($to)) {
        echo json_encode([
            'success' => false,
            'error' => 'Missing recipient email',
            'debug' => $logData
        ]);
        exit;
    }
    
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid email address',
            'debug' => $logData
        ]);
        exit;
    }
    
    // Build email
    $headers = [
        'From: ' . $fromName . ' <' . $fromEmail . '>',
        'Reply-To: ' . $replyTo,
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8'
    ];
    
    $htmlMessage = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        </style>
    </head>
    <body>
        <div class='container'>
            " . nl2br(htmlspecialchars($message)) . "
        </div>
    </body>
    </html>
    ";
    
    $logData['headers'] = $headers;
    $logData['html_message_length'] = strlen($htmlMessage);
    
    // Try to send
    try {
        $success = mail($to, $subject, $htmlMessage, implode("\r\n", $headers), "-f" . $fromEmail);
        $logData['mail_result'] = $success;
        
        if ($success) {
            echo json_encode([
                'success' => true,
                'message' => 'Email sent successfully',
                'debug' => $logData
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'mail() returned false',
                'debug' => $logData
            ]);
        }
    } catch (Exception $e) {
        $logData['exception'] = $e->getMessage();
        echo json_encode([
            'success' => false,
            'error' => 'Exception: ' . $e->getMessage(),
            'debug' => $logData
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed',
        'debug' => $logData
    ]);
}
?>
