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
    
    $email = trim($data['email'] ?? '');
    $name = trim($data['name'] ?? '');
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please provide a valid email address'
        ]);
        exit;
    }
    
    try {
        // Generate unsubscribe token
        $unsubscribeToken = bin2hex(random_bytes(32));
        
        // Check if email already exists
        $checkUrl = SUPABASE_URL . '/rest/v1/newsletter_subscribers?email=eq.' . urlencode($email);
        $ch = curl_init($checkUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY
        ]);
        $checkResponse = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        $existing = json_decode($checkResponse, true);
        
        if (!empty($existing)) {
            // Already subscribed
            if ($existing[0]['is_active']) {
                echo json_encode([
                    'success' => true,
                    'message' => 'You are already subscribed to our newsletter!'
                ]);
                exit;
            } else {
                // Reactivate subscription
                $updateUrl = SUPABASE_URL . '/rest/v1/newsletter_subscribers?email=eq.' . urlencode($email);
                $ch = curl_init($updateUrl);
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                    'is_active' => true,
                    'subscribed_at' => date('c')
                ]));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, [
                    'apikey: ' . SUPABASE_KEY,
                    'Authorization: Bearer ' . SUPABASE_KEY,
                    'Content-Type: application/json',
                    'Prefer: return=minimal'
                ]);
                curl_exec($ch);
                curl_close($ch);
            }
        } else {
            // New subscription
            $subscriberData = [
                'email' => $email,
                'name' => $name ?: null,
                'unsubscribe_token' => $unsubscribeToken,
                'is_active' => true
            ];
            
            $url = SUPABASE_URL . '/rest/v1/newsletter_subscribers';
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($subscriberData));
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
                throw new Exception('Failed to save subscription');
            }
        }
        
        // Send welcome email
        require_once 'email-footer.php';
        
        $subject = 'Welcome to SAKEC ACM Newsletter!';
        $displayName = $name ?: 'there';
        
        $emailContent = "
        <table width='100%' cellpadding='0' cellspacing='0'>
            <tr>
                <td style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center;'>
                    <h1 style='margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;'>🎉 Welcome to SAKEC ACM!</h1>
                    <p style='margin: 10px 0 0; opacity: 0.9; font-size: 14px;'>You're now part of our community</p>
                </td>
            </tr>
            <tr>
                <td style='padding: 40px; background: white;'>
                    <p style='font-size: 18px; color: #000; margin: 0 0 20px 0;'>Hi " . htmlspecialchars($displayName) . ",</p>
                    
                    <table width='100%' cellpadding='0' cellspacing='0' style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; margin: 30px 0;'>
                        <tr>
                            <td style='padding: 30px; text-align: center; color: white;'>
                                <h2 style='margin: 0 0 15px 0; font-size: 24px;'>Thank You for Subscribing!</h2>
                                <p style='margin: 0; opacity: 0.9;'>We're excited to have you join the SAKEC ACM Student Chapter newsletter community.</p>
                            </td>
                        </tr>
                    </table>
                    
                    <p style='margin: 20px 0;'>You've successfully subscribed to receive updates, event announcements, and exclusive content from SAKEC ACM Student Chapter.</p>
                    
                    <table width='100%' cellpadding='0' cellspacing='0' style='background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; margin: 30px 0;'>
                        <tr>
                            <td style='padding: 30px;'>
                                <h3 style='margin: 0 0 20px 0; color: #000; font-size: 18px; text-align: center;'>What You'll Receive:</h3>
                                <table width='100%' cellpadding='0' cellspacing='0'>
                                    <tr>
                                        <td style='padding: 10px 0;'>
                                            <table cellpadding='0' cellspacing='0'>
                                                <tr>
                                                    <td style='background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; vertical-align: middle; font-weight: bold;'>📅</td>
                                                    <td style='padding-left: 15px; color: #444;'><strong>Event Announcements</strong> - Be the first to know about upcoming workshops, hackathons, and tech talks</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 10px 0;'>
                                            <table cellpadding='0' cellspacing='0'>
                                                <tr>
                                                    <td style='background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; vertical-align: middle; font-weight: bold;'>💡</td>
                                                    <td style='padding-left: 15px; color: #444;'><strong>Tech Insights</strong> - Latest trends in technology, programming tips, and industry news</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 10px 0;'>
                                            <table cellpadding='0' cellspacing='0'>
                                                <tr>
                                                    <td style='background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; vertical-align: middle; font-weight: bold;'>🏆</td>
                                                    <td style='padding-left: 15px; color: #444;'><strong>Opportunities</strong> - Exclusive access to competitions, internships, and career opportunities</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 10px 0;'>
                                            <table cellpadding='0' cellspacing='0'>
                                                <tr>
                                                    <td style='background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; vertical-align: middle; font-weight: bold;'>🤝</td>
                                                    <td style='padding-left: 15px; color: #444;'><strong>Community Updates</strong> - Stories from our members and highlights from past events</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    
                    <table width='100%' cellpadding='0' cellspacing='0'>
                        <tr>
                            <td style='text-align: center; padding: 40px 0;'>
                                <a href='https://sakec.acm.org/events' style='display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold;'>Explore Upcoming Events</a>
                            </td>
                        </tr>
                    </table>
                    
                    <p style='color: #666; font-size: 14px; margin: 40px 0 0 0;'>
                        Stay connected with us on social media for daily updates and behind-the-scenes content!
                    </p>
                </td>
            </tr>
        </table>
        ";
        
        $message = wrapEmailContent($emailContent, $unsubscribeToken);
        
        $headers = [
            'From: SAKEC ACM Newsletter <newsletter@sakec.acm.org>',
            'Reply-To: support@sakec.acm.org',
            'X-Mailer: PHP/' . phpversion(),
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8'
        ];
        
        $emailSent = mail($email, $subject, $message, implode("\r\n", $headers));
        
        if (!$emailSent) {
            error_log('Failed to send welcome email to: ' . $email);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Successfully subscribed! Check your email for a welcome message.'
        ]);
        
    } catch (Exception $e) {
        error_log('Newsletter subscription error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to subscribe. Please try again later.'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
