<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $token = trim($data['token'] ?? '');
    
    if (empty($token)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid unsubscribe token'
        ]);
        exit;
    }
    
    try {
        // Find subscriber by token
        $checkUrl = SUPABASE_URL . '/rest/v1/newsletter_subscribers?unsubscribe_token=eq.' . urlencode($token);
        $ch = curl_init($checkUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY
        ]);
        $checkResponse = curl_exec($ch);
        curl_close($ch);
        
        $subscriber = json_decode($checkResponse, true);
        
        if (empty($subscriber)) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Subscriber not found or already unsubscribed'
            ]);
            exit;
        }
        
        $email = $subscriber[0]['email'];
        
        // Update subscriber to inactive
        $updateUrl = SUPABASE_URL . '/rest/v1/newsletter_subscribers?unsubscribe_token=eq.' . urlencode($token);
        $ch = curl_init($updateUrl);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'is_active' => false
        ]));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY,
            'Content-Type: application/json',
            'Prefer: return=minimal'
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 204 && $httpCode !== 200) {
            throw new Exception('Failed to update subscription status');
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Successfully unsubscribed',
            'email' => $email
        ]);
        
    } catch (Exception $e) {
        error_log('Unsubscribe error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to unsubscribe. Please try again later.'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
