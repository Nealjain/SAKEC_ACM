<?php
/**
 * Ultra-simple mail test
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Test 1: Can we even run PHP?
$result = [
    'php_works' => true,
    'php_version' => phpversion(),
    'mail_function_exists' => function_exists('mail'),
    'test_time' => date('Y-m-d H:i:s')
];

// Test 2: Try to send a simple email
if (function_exists('mail')) {
    $to = 'neal.18191@sakec.ac.in';
    $subject = 'Test Email';
    $message = 'This is a test email from ' . date('Y-m-d H:i:s');
    $headers = 'From: test@sakec.acm.org';
    
    $sent = @mail($to, $subject, $message, $headers);
    $result['mail_sent'] = $sent;
    $result['mail_error'] = error_get_last();
} else {
    $result['error'] = 'mail() function does not exist';
}

echo json_encode($result, JSON_PRETTY_PRINT);
?>
