<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

// Rate limiting - simple implementation
session_start();
$max_attempts = 5;
$lockout_time = 900; // 15 minutes

if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
    $_SESSION['last_attempt'] = time();
}

// Reset attempts after lockout time
if (time() - $_SESSION['last_attempt'] > $lockout_time) {
    $_SESSION['login_attempts'] = 0;
}

if ($_SESSION['login_attempts'] >= $max_attempts) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Too many failed attempts. Please try again later.'
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        $_SESSION['login_attempts']++;
        $_SESSION['last_attempt'] = time();
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Username and password are required'
        ]);
        exit;
    }
    
    try {
        // Query admin from Supabase
        $url = SUPABASE_URL . '/rest/v1/admins?username=eq.' . urlencode($username) . '&is_active=eq.true&select=*';
        
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
            throw new Exception('Database error');
        }
        
        $admins = json_decode($response, true);
        
        if (empty($admins)) {
            $_SESSION['login_attempts']++;
            $_SESSION['last_attempt'] = time();
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid credentials'
            ]);
            exit;
        }
        
        $admin = $admins[0];
        
        // Verify password
        if (password_verify($password, $admin['password_hash'])) {
            // Success - reset attempts
            $_SESSION['login_attempts'] = 0;
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_username'] = $admin['username'];
            $_SESSION['admin_logged_in'] = true;
            
            // Update last login
            $updateUrl = SUPABASE_URL . '/rest/v1/admins?id=eq.' . $admin['id'];
            $updateData = json_encode(['last_login' => date('c')]);
            
            $ch = curl_init($updateUrl);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
            curl_setopt($ch, CURLOPT_POSTFIELDS, $updateData);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'apikey: ' . SUPABASE_KEY,
                'Authorization: Bearer ' . SUPABASE_KEY,
                'Content-Type: application/json',
                'Prefer: return=minimal'
            ]);
            curl_exec($ch);
            curl_close($ch);
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'admin' => [
                    'username' => $admin['username'],
                    'email' => $admin['email']
                ]
            ]);
        } else {
            $_SESSION['login_attempts']++;
            $_SESSION['last_attempt'] = time();
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid credentials'
            ]);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Server error'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
