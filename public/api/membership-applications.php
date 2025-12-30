<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Fetch all membership applications
        $url = SUPABASE_URL . '/rest/v1/membership_applications?order=created_at.desc';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY,
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception('Failed to fetch applications');
        }
        
        $applications = json_decode($response, true);
        
        echo json_encode([
            'success' => true,
            'data' => $applications
        ]);
        
    } catch (Exception $e) {
        error_log('Membership applications fetch error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to fetch applications'
        ]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update application status
    $data = json_decode(file_get_contents('php://input'), true);
    
    $id = $data['id'] ?? '';
    $status = $data['status'] ?? '';
    
    if (empty($id) || empty($status)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'ID and status are required'
        ]);
        exit;
    }
    
    if (!in_array($status, ['pending', 'approved', 'rejected'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid status'
        ]);
        exit;
    }
    
    try {
        // Update application status
        $updateData = [
            'status' => $status,
            'updated_at' => date('c')
        ];
        
        $url = SUPABASE_URL . '/rest/v1/membership_applications?id=eq.' . urlencode($id);
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($updateData));
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
        
        if ($httpCode !== 204) {
            throw new Exception('Failed to update application status');
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Application status updated successfully'
        ]);
        
    } catch (Exception $e) {
        error_log('Membership application update error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update application status'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
?>