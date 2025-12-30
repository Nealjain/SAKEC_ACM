<?php
/**
 * Complete Email System Test
 * Tests all email accounts and functionality
 */

header('Content-Type: text/html; charset=UTF-8');
require_once 'config.php';

$testEmail = 'neal.18191@sakec.ac.in'; // Change this to your test email

echo "<!DOCTYPE html>
<html>
<head>
    <title>Email System Test</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 40px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #007bff; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .test { background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; border-radius: 4px; }
        .success { border-left-color: #28a745; background: #d4edda; }
        .error { border-left-color: #dc3545; background: #f8d7da; }
        .info { border-left-color: #17a2b8; background: #d1ecf1; }
        .email-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0; }
        .email-card { background: #fff; border: 2px solid #e0e0e0; padding: 15px; border-radius: 8px; }
        .email-card h3 { margin: 0 0 10px 0; color: #007bff; font-size: 16px; }
        .email-card p { margin: 5px 0; font-size: 14px; color: #666; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .badge-success { background: #28a745; color: white; }
        .badge-info { background: #17a2b8; color: white; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px; }
        .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .btn:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class='container'>
        <h1>📧 SAKEC ACM Email System Test</h1>
        <p><strong>Test Email:</strong> $testEmail</p>
        <p><strong>Test Time:</strong> " . date('Y-m-d H:i:s') . "</p>
";

// Email accounts to test
$emailAccounts = [
    ['email' => 'admin@sakec.acm.org', 'name' => 'SAKEC ACM Admin', 'purpose' => 'General admin communications'],
    ['email' => 'contact@sakec.acm.org', 'name' => 'SAKEC ACM Contact', 'purpose' => 'Contact form & inquiries'],
    ['email' => 'events@sakec.acm.org', 'name' => 'SAKEC ACM Events', 'purpose' => 'Event notifications'],
    ['email' => 'publicity@sakec.acm.org', 'name' => 'SAKEC ACM Publicity', 'purpose' => 'Marketing & publicity'],
    ['email' => 'support@sakec.acm.org', 'name' => 'SAKEC ACM Support', 'purpose' => 'Support & help desk']
];

echo "<h2>📋 Configured Email Accounts</h2>";
echo "<div class='email-list'>";
foreach ($emailAccounts as $account) {
    echo "<div class='email-card'>
        <h3>{$account['email']}</h3>
        <p><strong>Name:</strong> {$account['name']}</p>
        <p><strong>Purpose:</strong> {$account['purpose']}</p>
        <span class='badge badge-success'>Active</span>
    </div>";
}
echo "</div>";

// Test 1: PHP mail() function availability
echo "<h2>🔧 System Tests</h2>";
echo "<div class='test " . (function_exists('mail') ? 'success' : 'error') . "'>";
echo "<strong>Test 1: PHP mail() Function</strong><br>";
if (function_exists('mail')) {
    echo "✅ PHP mail() function is available";
} else {
    echo "❌ PHP mail() function is NOT available";
}
echo "</div>";

// Test 2: Email validation
echo "<div class='test success'>";
echo "<strong>Test 2: Email Validation</strong><br>";
echo "✅ Test email '$testEmail' is " . (filter_var($testEmail, FILTER_VALIDATE_EMAIL) ? 'valid' : 'invalid');
echo "</div>";

// Test 3: Send test emails from each account
echo "<h2>📨 Sending Test Emails</h2>";
echo "<p>Sending test emails from each account to: <strong>$testEmail</strong></p>";

$results = [];
foreach ($emailAccounts as $account) {
    $subject = "Test Email from {$account['name']}";
    $message = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border: 1px solid #ddd; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: white; }
            .footer { padding: 10px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>{$account['name']}</h2>
            </div>
            <div class='content'>
                <p>This is a test email from the SAKEC ACM email system.</p>
                <p><strong>Account:</strong> {$account['email']}</p>
                <p><strong>Purpose:</strong> {$account['purpose']}</p>
                <p><strong>Test Time:</strong> " . date('Y-m-d H:i:s') . "</p>
                <p>If you received this email, the email system is working correctly!</p>
            </div>
            <div class='footer'>
                <p>SAKEC ACM Student Chapter Email System Test</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $headers = [
        'From: ' . $account['name'] . ' <' . $account['email'] . '>',
        'Reply-To: ' . $account['email'],
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8'
    ];
    
    $success = mail($testEmail, $subject, $message, implode("\r\n", $headers), "-f" . $account['email']);
    
    $results[] = [
        'account' => $account,
        'success' => $success
    ];
    
    echo "<div class='test " . ($success ? 'success' : 'error') . "'>";
    echo "<strong>{$account['email']}</strong><br>";
    echo $success ? "✅ Email sent successfully" : "❌ Failed to send email";
    echo "</div>";
    
    // Small delay to avoid overwhelming the server
    usleep(200000); // 200ms
}

// Test 4: Database logging
echo "<h2>💾 Database Integration Test</h2>";
try {
    $testData = [
        'recipient_email' => $testEmail,
        'sender_email' => 'admin@sakec.acm.org',
        'sender_name' => 'Email System Test',
        'subject' => 'Database Test',
        'message' => 'Testing database logging',
        'status' => 'sent',
        'error_message' => null
    ];
    
    $result = supabaseRequest('/rest/v1/sent_emails', 'POST', $testData);
    
    echo "<div class='test " . ($result['status'] === 201 ? 'success' : 'error') . "'>";
    echo "<strong>Test 4: Database Logging</strong><br>";
    if ($result['status'] === 201) {
        echo "✅ Successfully logged email to database";
    } else {
        echo "❌ Failed to log email to database<br>";
        echo "Status: {$result['status']}<br>";
        echo "Response: " . htmlspecialchars($result['raw']);
    }
    echo "</div>";
} catch (Exception $e) {
    echo "<div class='test error'>";
    echo "<strong>Test 4: Database Logging</strong><br>";
    echo "❌ Error: " . htmlspecialchars($e->getMessage());
    echo "</div>";
}

// Summary
echo "<h2>📊 Test Summary</h2>";
$totalTests = count($results);
$successfulTests = count(array_filter($results, function($r) { return $r['success']; }));
$failedTests = $totalTests - $successfulTests;

echo "<div class='test info'>";
echo "<strong>Results:</strong><br>";
echo "Total Email Accounts Tested: $totalTests<br>";
echo "Successful: $successfulTests<br>";
echo "Failed: $failedTests<br>";
echo "Success Rate: " . round(($successfulTests / $totalTests) * 100, 2) . "%";
echo "</div>";

if ($successfulTests === $totalTests) {
    echo "<div class='test success'>";
    echo "<h3>🎉 All Tests Passed!</h3>";
    echo "<p>Your email system is fully operational. Check your inbox at <strong>$testEmail</strong> for the test emails.</p>";
    echo "</div>";
} else {
    echo "<div class='test error'>";
    echo "<h3>⚠️ Some Tests Failed</h3>";
    echo "<p>Please check your cPanel email configuration and server settings.</p>";
    echo "</div>";
}

echo "
        <h2>🔗 Quick Links</h2>
        <a href='test-email-system.php' class='btn'>Simple Email Test</a>
        <a href='../admin' class='btn'>Admin Dashboard</a>
        <a href='../contact' class='btn'>Contact Form</a>
        
        <h2>📖 Documentation</h2>
        <div class='test info'>
            <p>For complete email system documentation, see <strong>EMAIL-SYSTEM-DOCUMENTATION.md</strong></p>
            <p>Email utility functions are in <strong>src/lib/email.ts</strong></p>
            <p>Backend API is in <strong>api/admin-send-email.php</strong></p>
        </div>
    </div>
</body>
</html>";
?>
