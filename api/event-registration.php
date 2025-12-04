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
    
    $formId = $data['form_id'] ?? '';
    $eventId = $data['event_id'] ?? '';
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $phone = $data['phone'] ?? '';
    $formData = $data['form_data'] ?? [];
    
    if (empty($formId) || empty($eventId) || empty($name) || empty($email)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields'
        ]);
        exit;
    }
    
    try {
        // Insert registration into Supabase
        $registrationData = [
            'form_id' => $formId,
            'event_id' => $eventId,
            'participant_name' => $name,
            'participant_email' => $email,
            'participant_phone' => $phone,
            'form_data' => json_encode($formData),
            'confirmation_sent' => false,
            'status' => 'confirmed'
        ];
        
        $url = SUPABASE_URL . '/rest/v1/event_registrations';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($registrationData));
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
            throw new Exception('Failed to save registration');
        }
        
        $registration = json_decode($response, true)[0] ?? null;
        
        // Get event details for confirmation email
        $eventUrl = SUPABASE_URL . '/rest/v1/events?id=eq.' . $eventId . '&select=*';
        $ch = curl_init($eventUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . SUPABASE_KEY,
            'Authorization: Bearer ' . SUPABASE_KEY
        ]);
        $eventResponse = curl_exec($ch);
        curl_close($ch);
        
        $event = json_decode($eventResponse, true)[0] ?? null;
        
        // Send confirmation email
        if ($event && $registration) {
            $subject = 'Event Registration Confirmation - ' . $event['title'];
            
            // Build custom form data display
            $formDataHtml = '';
            if (!empty($formData)) {
                $formDataHtml = "<div style='background: #f9f9f9; padding: 20px; border: 1px solid #eee; border-radius: 4px; margin: 25px 0;'>
                    <h3 style='color: #000; margin-top: 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 15px;'>Registration Details</h3>";
                foreach ($formData as $key => $value) {
                    if ($key !== 'name' && $key !== 'email' && $key !== 'phone') {
                        $displayKey = ucwords(str_replace('_', ' ', $key));
                        $displayValue = is_array($value) ? implode(', ', $value) : $value;
                        $formDataHtml .= "<div style='padding: 8px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;'>
                            <strong style='color: #666;'>" . htmlspecialchars($displayKey) . ":</strong> 
                            <span style='color: #000; text-align: right;'>" . htmlspecialchars($displayValue) . "</span>
                        </div>";
                    }
                }
                $formDataHtml .= "</div>";
            }
            
            $message = "
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #000; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 40px auto; background: white; border: 1px solid #ddd; }
                    .header { background: #000; color: white; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px; text-transform: uppercase; }
                    .header p { margin: 5px 0 0; opacity: 0.7; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }
                    .content { padding: 40px; background: white; }
                    .greeting { font-size: 18px; margin-bottom: 25px; }
                    .event-card { border: 1px solid #000; padding: 30px; margin: 30px 0; background: #fff; }
                    .event-title { color: #000; margin: 0 0 25px 0; font-size: 24px; font-weight: bold; text-align: center; }
                    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
                    .detail-row:last-child { border-bottom: none; }
                    .detail-label { font-weight: 600; color: #666; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
                    .detail-value { color: #000; font-weight: 500; text-align: right; }
                    .info-box { background: #f9f9f9; border: 1px solid #eee; padding: 20px; margin: 30px 0; font-size: 14px; color: #444; }
                    .info-box strong { color: #000; display: block; margin-bottom: 10px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
                    .signature { margin-top: 50px; padding-top: 30px; border-top: 1px solid #eee; }
                    .footer { background: #f9f9f9; padding: 30px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; }
                    .footer-logo { font-size: 24px; margin-bottom: 15px; color: #000; }
                    @media only screen and (max-width: 600px) {
                        .container { margin: 0; border: none; }
                        .content { padding: 20px; }
                        .detail-row { flex-direction: column; align-items: flex-start; }
                        .detail-value { text-align: left; margin-top: 5px; }
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>Registration Confirmed</h1>
                        <p>SAKEC ACM Student Chapter</p>
                    </div>
                    <div class='content'>
                        <p class='greeting'>Dear " . htmlspecialchars($name) . ",</p>
                        <p>Your registration has been successfully confirmed. We look forward to your participation.</p>
                        
                        <div class='event-card'>
                            <h2 class='event-title'>" . htmlspecialchars($event['title']) . "</h2>
                            <div class='detail-row'>
                                <span class='detail-label'>Date</span>
                                <span class='detail-value'>" . date('F j, Y', strtotime($event['date'])) . "</span>
                            </div>
                            <div class='detail-row'>
                                <span class='detail-label'>Time</span>
                                <span class='detail-value'>" . ($event['time'] ?? 'TBA') . "</span>
                            </div>
                            <div class='detail-row'>
                                <span class='detail-label'>Venue</span>
                                <span class='detail-value'>" . htmlspecialchars($event['location']) . "</span>
                            </div>
                            <div class='detail-row'>
                                <span class='detail-label'>Email</span>
                                <span class='detail-value'>" . htmlspecialchars($email) . "</span>
                            </div>
                            " . ($phone ? "<div class='detail-row'>
                                <span class='detail-label'>Phone</span>
                                <span class='detail-value'>" . htmlspecialchars($phone) . "</span>
                            </div>" : "") . "
                        </div>
                        
                        " . $formDataHtml . "
                        
                        <div class='info-box'>
                            <strong>Important Reminders</strong>
                            <ul style='margin: 0; padding-left: 20px; color: #444;'>
                                <li style='margin-bottom: 5px;'>Please save this email for your records</li>
                                <li style='margin-bottom: 5px;'>Arrive 15 minutes prior to the event</li>
                                <li style='margin-bottom: 5px;'>Bring a valid ID for verification</li>
                            </ul>
                        </div>
                        
                        <p>If you have any questions, please reply to this email.</p>
                        
                        <div class='signature'>
                            <p style='margin: 0; font-weight: bold;'>SAKEC ACM Events Team</p>
                            <p style='margin: 5px 0 0 0; color: #666; font-size: 14px;'>Shah & Anchor Kutchhi Engineering College</p>
                        </div>
                    </div>
                    <div class='footer'>
                        <div class='footer-logo'>SAKEC ACM</div>
                        <p>This is an automated confirmation email.</p>
                        <p>© " . date('Y') . " SAKEC ACM Student Chapter. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            ";
            
            $headers = [
                'From: ' . CONTACT_EMAIL,
                'Reply-To: ' . CONTACT_EMAIL,
                'X-Mailer: PHP/' . phpversion(),
                'MIME-Version: 1.0',
                'Content-Type: text/html; charset=UTF-8'
            ];
            
            $emailSent = mail($email, $subject, $message, implode("\r\n", $headers));
            
            // Update confirmation_sent status
            if ($emailSent) {
                $updateUrl = SUPABASE_URL . '/rest/v1/event_registrations?id=eq.' . $registration['id'];
                $ch = curl_init($updateUrl);
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['confirmation_sent' => true]));
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
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful! Confirmation email sent.',
            'registration_id' => $registration['id'] ?? null
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Registration failed: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
