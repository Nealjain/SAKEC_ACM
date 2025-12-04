<?php
/**
 * cPanel Email Configuration Guide
 * 
 * This file contains instructions for setting up email with cPanel
 * 
 * OPTION 1: Using PHP mail() function (Simplest - Already configured)
 * - Works with cPanel's default mail server
 * - No additional libraries needed
 * - Already implemented in admin-send-email.php and send-email.php
 * 
 * OPTION 2: Using SMTP with PHPMailer (More reliable)
 * - Better deliverability
 * - More control over email sending
 * - Requires PHPMailer library
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create Email Account in cPanel:
 *    - Login to cPanel
 *    - Go to "Email Accounts"
 *    - Create email: support@sakec.acm.org (or your domain)
 *    - Set a strong password
 *    - Note down the credentials
 * 
 * 2. Update config.php with your email credentials:
 *    - SMTP_HOST: Usually 'mail.yourdomain.com' or 'localhost'
 *    - SMTP_PORT: 587 (TLS) or 465 (SSL)
 *    - SMTP_USERNAME: Your full email address
 *    - SMTP_PASSWORD: Your email password
 * 
 * 3. Test Email Sending:
 *    - Use the test script below
 *    - Check spam folder if not received
 *    - Check cPanel email logs
 * 
 * CURRENT CONFIGURATION:
 * The system is already configured to use PHP mail() function
 * which works with cPanel's mail server automatically.
 * 
 * TROUBLESHOOTING:
 * - If emails not sending: Check cPanel mail logs
 * - If going to spam: Configure SPF, DKIM, DMARC records
 * - If authentication fails: Verify email credentials in cPanel
 */

// Test email function
function testCPanelEmail() {
    $to = 'test@example.com'; // Change to your test email
    $subject = 'Test Email from cPanel';
    $message = 'This is a test email sent from your cPanel mail server.';
    
    $headers = [
        'From: SAKEC ACM <support@sakec.acm.org>',
        'Reply-To: support@sakec.acm.org',
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8'
    ];
    
    $success = mail($to, $subject, $message, implode("\r\n", $headers));
    
    if ($success) {
        echo "✅ Test email sent successfully!\n";
        echo "Check your inbox at: $to\n";
    } else {
        echo "❌ Failed to send test email.\n";
        echo "Check cPanel mail logs for details.\n";
    }
}

// Uncomment to test:
// testCPanelEmail();

/**
 * RECOMMENDED SETTINGS FOR CPANEL:
 * 
 * In config.php, use these settings:
 * 
 * For local cPanel mail server:
 * define('SMTP_HOST', 'localhost');
 * define('SMTP_PORT', 587);
 * 
 * For remote cPanel mail server:
 * define('SMTP_HOST', 'mail.sakec.acm.org');
 * define('SMTP_PORT', 587);
 * 
 * Authentication:
 * define('SMTP_USERNAME', 'support@sakec.acm.org');
 * define('SMTP_PASSWORD', 'your_password_here');
 * define('SMTP_SECURE', 'tls');
 * 
 * IMPORTANT NOTES:
 * 1. PHP mail() function is already working with your current setup
 * 2. No changes needed unless you want SMTP authentication
 * 3. Make sure your domain has proper DNS records (MX, SPF, DKIM)
 * 4. Check cPanel > Email Deliverability for DNS status
 */
?>
