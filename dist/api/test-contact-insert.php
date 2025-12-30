<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

// Test inserting a contact message directly
$testData = [
    'name' => 'Test User',
    'email' => 'test@example.com',
    'subject' => 'Test Subject',
    'message' => 'This is a test message from PHP'
];

try {
    $result = supabaseRequest('/rest/v1/contact_messages', 'POST', $testData);
    
    echo json_encode([
        'success' => true,
        'status' => $result['status'],
        'message' => 'Test insert completed',
        'result' => $result
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>
