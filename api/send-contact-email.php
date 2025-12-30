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
    
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $subject = trim($data['subject'] ?? '');
    $message = trim($data['message'] ?? '');
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'All fields are required'
        ]);
        exit;
    }
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please provide a valid email address'
        ]);
        exit;
    }
    
    try {
        // Step 1: Save to Supabase database first
        $contactData = [
            'name' => $name,
            'email' => $email,
            'subject' => $subject,
            'message' => $message
        ];
        
        $url = SUPABASE_URL . '/rest/v1/contact_messages';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($contactData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY,
            'Content-Type: application/json',
            'Prefer: return=representation'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 201) {
            throw new Exception('Failed to save contact message to database');
        }
        
        // Step 2: Send email notifications (after successful database save)
        try {
            // Send notification to admin
            $adminSubject = 'New Contact Form Submission - ' . $subject;
            $adminMessage = "
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> {$name} ({$email})</p>
            <p><strong>Subject:</strong> {$subject}</p>
            <p><strong>Message:</strong></p>
            <div style='background: #f5f5f5; padding: 15px; border-left: 4px solid #333; margin: 15px 0;'>
                " . nl2br(htmlspecialchars($message)) . "
            </div>
            <p><strong>Submitted:</strong> " . date('Y-m-d H:i:s') . "</p>
            ";
            
            $adminHeaders = [
                'From: SAKEC ACM Website <noreply@sakec.acm.org>',
                'Reply-To: ' . $email,
                'X-Mailer: PHP/' . phpversion(),
                'MIME-Version: 1.0',
                'Content-Type: text/html; charset=UTF-8'
            ];
            
            $adminEmailSent = mail(CONTACT_EMAIL, $adminSubject, $adminMessage, implode("\r\n", $adminHeaders));
            
            // Send thank you email to user
            $userSubject = 'Thank you for contacting SAKEC ACM Student Chapter';
            $userMessage = "
            <h2>Thank you for reaching out!</h2>
            <p>Dear {$name},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            
            <div style='background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; margin: 20px 0;'>
                <h3>Your Message:</h3>
                <p><strong>Subject:</strong> {$subject}</p>
                <p><strong>Message:</strong></p>
                <div style='background: white; padding: 15px; border-left: 4px solid #333; margin: 10px 0;'>
                    " . nl2br(htmlspecialchars($message)) . "
                </div>
            </div>
            
            <p>If you have any urgent questions, you can also reach us directly at:</p>
            <ul>
                <li>Email: support@sakec.acm.org</li>
                <li>Website: https://sakec.acm.org</li>
            </ul>
            
            <p>Best regards,<br>SAKEC ACM Student Chapter Team</p>
            ";
            
            $userHeaders = [
                'From: SAKEC ACM Student Chapter <support@sakec.acm.org>',
                'Reply-To: support@sakec.acm.org',
                'X-Mailer: PHP/' . phpversion(),
                'MIME-Version: 1.0',
                'Content-Type: text/html; charset=UTF-8'
            ];
            
            $userEmailSent = mail($email, $userSubject, $userMessage, implode("\r\n", $userHeaders));
            
            if (!$adminEmailSent) {
                error_log('Failed to send admin notification for contact form from: ' . $email);
            }
            
            if (!$userEmailSent) {
                error_log('Failed to send thank you email to: ' . $email);
            }
            
        } catch (Exception $emailError) {
            error_log('Email sending error: ' . $emailError->getMessage());
            // Don't fail the whole process if email fails - message is already saved
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for your message! We will get back to you soon.'
        ]);
        
    } catch (Exception $e) {
        error_log('Contact form error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to send message. Please try again later.'
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