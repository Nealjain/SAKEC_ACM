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
            require_once 'email-footer.php';
            
            $subject = 'Event Registration Confirmation - ' . $event['title'];
            
            // Build custom form data display
            $formDataHtml = '';
            if (!empty($formData)) {
                $formDataHtml = "
                <tr>
                    <td style='padding: 25px 0;'>
                        <table width='100%' cellpadding='0' cellspacing='0' style='background: #f9f9f9; border: 1px solid #eee; border-radius: 4px;'>
                            <tr>
                                <td style='padding: 20px;'>
                                    <h3 style='color: #000; margin: 0 0 15px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #000; padding-bottom: 10px;'>Registration Details</h3>";
                foreach ($formData as $key => $value) {
                    if ($key !== 'name' && $key !== 'email' && $key !== 'phone') {
                        $displayKey = ucwords(str_replace('_', ' ', $key));
                        $displayValue = is_array($value) ? implode(', ', $value) : $value;
                        $formDataHtml .= "
                                    <table width='100%' cellpadding='0' cellspacing='0' style='padding: 8px 0; border-bottom: 1px solid #eee;'>
                                        <tr>
                                            <td style='color: #666; font-weight: bold;'>" . htmlspecialchars($displayKey) . ":</td>
                                            <td style='color: #000; text-align: right;'>" . htmlspecialchars($displayValue) . "</td>
                                        </tr>
                                    </table>";
                    }
                }
                $formDataHtml .= "
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>";
            }
            
            $emailContent = "
            <table width='100%' cellpadding='0' cellspacing='0'>
                <tr>
                    <td style='background: #000; color: white; padding: 30px; text-align: center;'>
                        <h1 style='margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px; text-transform: uppercase;'>Registration Confirmed</h1>
                        <p style='margin: 5px 0 0; opacity: 0.7; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;'>SAKEC ACM Student Chapter</p>
                    </td>
                </tr>
                <tr>
                    <td style='padding: 40px; background: white;'>
                        <p style='font-size: 18px; margin: 0 0 25px 0;'>Dear " . htmlspecialchars($name) . ",</p>
                        <p style='margin: 0 0 20px 0;'>Thank you for showing interest in this event. Your registration has been successfully confirmed. We will shortly get back to you with more details.</p>
                        
                        <table width='100%' cellpadding='0' cellspacing='0' style='border: 1px solid #000; margin: 30px 0;'>
                            <tr>
                                <td style='padding: 30px;'>
                                    <h2 style='color: #000; margin: 0 0 25px 0; font-size: 24px; font-weight: bold; text-align: center;'>" . htmlspecialchars($event['title']) . "</h2>
                                    <table width='100%' cellpadding='0' cellspacing='0'>
                                        <tr>
                                            <td style='padding: 12px 0; border-bottom: 1px solid #eee;'>
                                                <table width='100%'>
                                                    <tr>
                                                        <td style='font-weight: 600; color: #666; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;'>Date</td>
                                                        <td style='color: #000; font-weight: 500; text-align: right;'>" . date('F j, Y', strtotime($event['date'])) . "</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 12px 0; border-bottom: 1px solid #eee;'>
                                                <table width='100%'>
                                                    <tr>
                                                        <td style='font-weight: 600; color: #666; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;'>Time</td>
                                                        <td style='color: #000; font-weight: 500; text-align: right;'>" . ($event['time'] ?? 'TBA') . "</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 12px 0; border-bottom: 1px solid #eee;'>
                                                <table width='100%'>
                                                    <tr>
                                                        <td style='font-weight: 600; color: #666; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;'>Venue</td>
                                                        <td style='color: #000; font-weight: 500; text-align: right;'>" . htmlspecialchars($event['location']) . "</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 12px 0; border-bottom: 1px solid #eee;'>
                                                <table width='100%'>
                                                    <tr>
                                                        <td style='font-weight: 600; color: #666; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;'>Email</td>
                                                        <td style='color: #000; font-weight: 500; text-align: right;'>" . htmlspecialchars($email) . "</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        " . ($phone ? "<tr>
                                            <td style='padding: 12px 0;'>
                                                <table width='100%'>
                                                    <tr>
                                                        <td style='font-weight: 600; color: #666; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;'>Phone</td>
                                                        <td style='color: #000; font-weight: 500; text-align: right;'>" . htmlspecialchars($phone) . "</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>" : "") . "
                                    </table>
                                </td>
                            </tr>
                        </table>
                        
                        " . $formDataHtml . "
                        
                        <table width='100%' cellpadding='0' cellspacing='0' style='background: #f9f9f9; border: 1px solid #eee; margin: 30px 0;'>
                            <tr>
                                <td style='padding: 20px;'>
                                    <strong style='color: #000; display: block; margin-bottom: 10px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;'>Important Reminders</strong>
                                    <ul style='margin: 0; padding-left: 20px; color: #444;'>
                                        <li style='margin-bottom: 5px;'>Please save this email for your records</li>
                                        <li style='margin-bottom: 5px;'>Arrive 15 minutes prior to the event</li>
                                        <li style='margin-bottom: 5px;'>Bring a valid ID for verification</li>
                                    </ul>
                                </td>
                            </tr>
                        </table>
                        
                        <p style='margin: 20px 0;'>If you have any questions, please reply to this email.</p>
                    </td>
                </tr>
            </table>
            ";
            
            $message = wrapEmailContent($emailContent);
            
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
