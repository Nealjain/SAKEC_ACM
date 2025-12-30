<?php
/**
 * Email System Diagnostic Tool
 * Visit this file in your browser to test email functionality
 */

header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Email System Diagnostic</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .test { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .success { color: #22c55e; font-weight: bold; }
        .error { color: #ef4444; font-weight: bold; }
        .warning { color: #f59e0b; font-weight: bold; }
        .info { color: #3b82f6; font-weight: bold; }
        pre { background: #f9f9f9; padding: 10px; border-radius: 4px; overflow-x: auto; }
        h1 { color: #333; }
        h2 { color: #666; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
        .status { display: inline-block; padding: 5px 10px; border-radius: 4px; margin: 5px 0; }
        .status.pass { background: #d1fae5; color: #065f46; }
        .status.fail { background: #fee2e2; color: #991b1b; }
        .status.warn { background: #fef3c7; color: #92400e; }
    </style>
</head>
<body>
    <h1>📧 Email System Diagnostic Tool</h1>
    <p>This tool will help diagnose email sending issues.</p>

    <?php
    // Test 1: PHP mail() function availability
    echo '<div class="test">';
    echo '<h2>Test 1: PHP mail() Function</h2>';
    if (function_exists('mail')) {
        echo '<span class="status pass">✓ PASS</span> PHP mail() function is available<br>';
    } else {
        echo '<span class="status fail">✗ FAIL</span> PHP mail() function is NOT available<br>';
        echo '<p class="error">Contact your hosting provider to enable PHP mail() function.</p>';
    }
    echo '</div>';

    // Test 2: Check PHP version
    echo '<div class="test">';
    echo '<h2>Test 2: PHP Version</h2>';
    $phpVersion = phpversion();
    echo '<span class="status pass">✓ PASS</span> PHP Version: ' . $phpVersion . '<br>';
    if (version_compare($phpVersion, '7.4.0', '>=')) {
        echo '<p class="success">PHP version is compatible.</p>';
    } else {
        echo '<p class="warning">PHP version is old. Recommended: 7.4 or higher.</p>';
    }
    echo '</div>';

    // Test 3: Check if config.php exists
    echo '<div class="test">';
    echo '<h2>Test 3: Configuration File</h2>';
    if (file_exists('config.php')) {
        echo '<span class="status pass">✓ PASS</span> config.php exists<br>';
        require_once 'config.php';
        if (defined('CONTACT_EMAIL')) {
            echo '<p class="success">Contact email configured: ' . CONTACT_EMAIL . '</p>';
        } else {
            echo '<p class="warning">CONTACT_EMAIL not defined in config.php</p>';
        }
    } else {
        echo '<span class="status fail">✗ FAIL</span> config.php not found<br>';
        echo '<p class="error">Upload config.php to the api/ folder.</p>';
    }
    echo '</div>';

    // Test 4: Check CORS headers
    echo '<div class="test">';
    echo '<h2>Test 4: CORS Headers</h2>';
    $headers = headers_list();
    $corsFound = false;
    foreach ($headers as $header) {
        if (stripos($header, 'Access-Control-Allow-Origin') !== false) {
            $corsFound = true;
            break;
        }
    }
    if ($corsFound) {
        echo '<span class="status pass">✓ PASS</span> CORS headers are set<br>';
    } else {
        echo '<span class="status warn">⚠ WARNING</span> CORS headers may not be set<br>';
    }
    echo '</div>';

    // Test 5: Try sending a test email
    echo '<div class="test">';
    echo '<h2>Test 5: Send Test Email</h2>';
    
    if (isset($_POST['test_email'])) {
        $testEmail = filter_var($_POST['test_email'], FILTER_SANITIZE_EMAIL);
        
        if (filter_var($testEmail, FILTER_VALIDATE_EMAIL)) {
            $subject = 'Test Email from SAKEC ACM';
            $message = '
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
                    .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
                    .content { background: white; padding: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Test Email</h1>
                    </div>
                    <div class="content">
                        <p>This is a test email from your SAKEC ACM website.</p>
                        <p>If you received this, your email system is working correctly!</p>
                        <p><strong>Test Details:</strong></p>
                        <ul>
                            <li>Sent at: ' . date('Y-m-d H:i:s') . '</li>
                            <li>Server: ' . $_SERVER['SERVER_NAME'] . '</li>
                            <li>PHP Version: ' . phpversion() . '</li>
                        </ul>
                    </div>
                </div>
            </body>
            </html>
            ';
            
            $headers = [
                'From: SAKEC ACM <' . (defined('CONTACT_EMAIL') ? CONTACT_EMAIL : 'noreply@' . $_SERVER['SERVER_NAME']) . '>',
                'Reply-To: ' . (defined('CONTACT_EMAIL') ? CONTACT_EMAIL : 'noreply@' . $_SERVER['SERVER_NAME']),
                'X-Mailer: PHP/' . phpversion(),
                'MIME-Version: 1.0',
                'Content-Type: text/html; charset=UTF-8'
            ];
            
            $result = mail($testEmail, $subject, $message, implode("\r\n", $headers));
            
            if ($result) {
                echo '<span class="status pass">✓ SUCCESS</span> Test email sent to: ' . htmlspecialchars($testEmail) . '<br>';
                echo '<p class="success">Check your inbox (and spam folder) for the test email.</p>';
            } else {
                echo '<span class="status fail">✗ FAILED</span> Could not send test email<br>';
                echo '<p class="error">Possible reasons:</p>';
                echo '<ul>';
                echo '<li>PHP mail() is disabled by hosting provider</li>';
                echo '<li>Server mail configuration is incorrect</li>';
                echo '<li>Firewall blocking outgoing mail</li>';
                echo '<li>Domain not verified for sending email</li>';
                echo '</ul>';
                echo '<p><strong>Solution:</strong> Contact your hosting provider (cPanel support) and ask them to:</p>';
                echo '<ol>';
                echo '<li>Enable PHP mail() function</li>';
                echo '<li>Configure mail server properly</li>';
                echo '<li>Check if domain is verified for sending email</li>';
                echo '</ol>';
            }
        } else {
            echo '<span class="status fail">✗ INVALID</span> Invalid email address<br>';
        }
    } else {
        echo '<form method="POST">';
        echo '<p>Enter your email address to receive a test email:</p>';
        echo '<input type="email" name="test_email" placeholder="your-email@example.com" required style="padding: 10px; width: 300px; border: 1px solid #ddd; border-radius: 4px;">';
        echo '<button type="submit" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">Send Test Email</button>';
        echo '</form>';
    }
    echo '</div>';

    // Test 6: Check server information
    echo '<div class="test">';
    echo '<h2>Test 6: Server Information</h2>';
    echo '<pre>';
    echo 'Server Software: ' . $_SERVER['SERVER_SOFTWARE'] . "\n";
    echo 'Server Name: ' . $_SERVER['SERVER_NAME'] . "\n";
    echo 'Document Root: ' . $_SERVER['DOCUMENT_ROOT'] . "\n";
    echo 'PHP Version: ' . phpversion() . "\n";
    echo 'Current Directory: ' . getcwd() . "\n";
    echo '</pre>';
    echo '</div>';

    // Test 7: Check file permissions
    echo '<div class="test">';
    echo '<h2>Test 7: File Permissions</h2>';
    $files = ['config.php', 'admin-send-email.php', 'send-email.php'];
    foreach ($files as $file) {
        if (file_exists($file)) {
            $perms = fileperms($file);
            $permsOctal = substr(sprintf('%o', $perms), -4);
            echo '<span class="status pass">✓</span> ' . $file . ' - Permissions: ' . $permsOctal . '<br>';
        } else {
            echo '<span class="status fail">✗</span> ' . $file . ' - NOT FOUND<br>';
        }
    }
    echo '</div>';

    // Recommendations
    echo '<div class="test">';
    echo '<h2>📋 Recommendations</h2>';
    echo '<ol>';
    echo '<li><strong>If test email fails:</strong> Contact your hosting provider to enable PHP mail()</li>';
    echo '<li><strong>Check spam folder:</strong> Test emails often go to spam initially</li>';
    echo '<li><strong>Configure DNS:</strong> Set up SPF, DKIM, and DMARC records in cPanel</li>';
    echo '<li><strong>Verify domain:</strong> Make sure your domain is verified for sending email</li>';
    echo '<li><strong>Check logs:</strong> Review cPanel error logs and email logs</li>';
    echo '</ol>';
    echo '</div>';
    ?>

    <div class="test">
        <h2>🔧 Quick Fixes</h2>
        <h3>If emails are not sending:</h3>
        <ol>
            <li><strong>Check cPanel Email Deliverability:</strong>
                <ul>
                    <li>Login to cPanel</li>
                    <li>Go to "Email Deliverability"</li>
                    <li>Look for red X marks</li>
                    <li>Click "Manage" and fix issues</li>
                </ul>
            </li>
            <li><strong>Create Email Account:</strong>
                <ul>
                    <li>cPanel → Email Accounts</li>
                    <li>Create: support@sakec.acm.org</li>
                    <li>Test sending from webmail</li>
                </ul>
            </li>
            <li><strong>Alternative: Use SMTP:</strong>
                <ul>
                    <li>Install PHPMailer</li>
                    <li>Configure SMTP settings</li>
                    <li>Use authenticated email sending</li>
                </ul>
            </li>
        </ol>
    </div>

    <div class="test">
        <p><strong>Need more help?</strong> Share the results of this diagnostic with your hosting provider or developer.</p>
    </div>
</body>
</html>
