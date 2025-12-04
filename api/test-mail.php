<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Test if mail function works
$to = 'test@example.com';
$subject = 'Test Email';
$message = 'This is a test email';
$headers = 'From: noreply@sakec.acm.org';

$result = mail($to, $subject, $message, $headers);

echo json_encode([
    'mail_function_exists' => function_exists('mail'),
    'mail_result' => $result,
    'php_version' => phpversion(),
    'server_info' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
]);
?>
