<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

// Test if we can query event_registration_forms
try {
    $result = supabaseRequest('/rest/v1/event_registration_forms?select=id,event_id,form_title&limit=5', 'GET');
    
    echo json_encode([
        'success' => true,
        'status' => $result['status'],
        'message' => 'Query successful',
        'data' => $result['data'],
        'note' => 'If status is 406, RLS policies are blocking access. Run QUICK-FIX-406-ERRORS.sql in Supabase.'
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>
