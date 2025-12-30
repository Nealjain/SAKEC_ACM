<?php
/**
 * Generate standardized email footer for all SAKEC ACM emails
 * 
 * @param string $unsubscribeToken Optional token for newsletter unsubscribe
 * @return string HTML footer content
 */
function getEmailFooter($unsubscribeToken = null) {
    $currentYear = date('Y');
    $unsubscribeLink = '';
    
    if ($unsubscribeToken) {
        $unsubscribeLink = "
        <tr>
            <td style='padding: 15px 0; border-top: 1px solid #eee;'>
                <p style='margin: 0; font-size: 12px; color: #888;'>
                    Don't want to receive these emails? 
                    <a href='https://sakec.acm.org/unsubscribe?token=" . htmlspecialchars($unsubscribeToken) . "' style='color: #667eea; text-decoration: none;'>Unsubscribe</a>
                </p>
            </td>
        </tr>";
    }
    
    return "
    <table width='100%' cellpadding='0' cellspacing='0' style='background: #f9f9f9; border-top: 1px solid #eee;'>
        <tr>
            <td style='padding: 40px 30px;'>
                <table width='100%' cellpadding='0' cellspacing='0'>
                    <!-- ACM Logo/Branding -->
                    <tr>
                        <td style='text-align: center; padding-bottom: 20px;'>
                            <img src='https://sakec.acm.org/logo.png' alt='SAKEC ACM Logo' style='width: 120px; height: auto; margin-bottom: 15px;' />
                            <div style='font-size: 20px; font-weight: bold; color: #000; letter-spacing: 2px; margin-top: 10px;'>
                                SAKEC ACM STUDENT CHAPTER
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Divider -->
                    <tr>
                        <td style='padding: 15px 0;'>
                            <div style='height: 1px; background: linear-gradient(to right, transparent, #ddd, transparent);'></div>
                        </td>
                    </tr>
                    
                    <!-- Contact Info -->
                    <tr>
                        <td style='text-align: center; padding: 15px 0;'>
                            <p style='margin: 0 0 10px 0; font-size: 14px; color: #000; font-weight: 600;'>
                                Shah & Anchor Kutchhi Engineering College
                            </p>
                            <p style='margin: 0 0 5px 0; font-size: 13px; color: #666;'>
                                W.T. Patil Marg, Chembur, Mumbai - 400088
                            </p>
                            <p style='margin: 0; font-size: 13px; color: #666;'>
                                Maharashtra, India
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Social Links -->
                    <tr>
                        <td style='text-align: center; padding: 20px 0;'>
                            <table cellpadding='0' cellspacing='0' style='margin: 0 auto;'>
                                <tr>
                                    <td style='padding: 0 10px;'>
                                        <a href='https://sakec.acm.org' style='color: #667eea; text-decoration: none; font-size: 13px; font-weight: 500;'>Website</a>
                                    </td>
                                    <td style='padding: 0 10px; color: #ddd;'>|</td>
                                    <td style='padding: 0 10px;'>
                                        <a href='https://sakec.acm.org/events' style='color: #667eea; text-decoration: none; font-size: 13px; font-weight: 500;'>Events</a>
                                    </td>
                                    <td style='padding: 0 10px; color: #ddd;'>|</td>
                                    <td style='padding: 0 10px;'>
                                        <a href='https://sakec.acm.org/contact' style='color: #667eea; text-decoration: none; font-size: 13px; font-weight: 500;'>Contact</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Email Contact -->
                    <tr>
                        <td style='text-align: center; padding: 10px 0;'>
                            <p style='margin: 0; font-size: 13px; color: #666;'>
                                📧 <a href='mailto:support@sakec.acm.org' style='color: #667eea; text-decoration: none;'>support@sakec.acm.org</a>
                            </p>
                        </td>
                    </tr>
                    
                    " . $unsubscribeLink . "
                    
                    <!-- Copyright -->
                    <tr>
                        <td style='text-align: center; padding: 20px 0 0 0; border-top: 1px solid #eee;'>
                            <p style='margin: 0; font-size: 12px; color: #888;'>
                                © " . $currentYear . " SAKEC ACM Student Chapter. All rights reserved.
                            </p>
                            <p style='margin: 5px 0 0 0; font-size: 11px; color: #aaa;'>
                                This is an automated email. Please do not reply directly to this message.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>";
}

/**
 * Wrap email content with standard HTML structure and footer
 * 
 * @param string $content Main email content (HTML)
 * @param string $unsubscribeToken Optional token for newsletter unsubscribe
 * @return string Complete HTML email
 */
function wrapEmailContent($content, $unsubscribeToken = null) {
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #000; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            @media only screen and (max-width: 600px) {
                .container { width: 100% !important; }
                table { width: 100% !important; }
            }
        </style>
    </head>
    <body>
        <table class='container' width='600' cellpadding='0' cellspacing='0' style='margin: 0 auto; background: white; border: 1px solid #ddd;'>
            <tr>
                <td>
                    " . $content . "
                </td>
            </tr>
            <tr>
                <td>
                    " . getEmailFooter($unsubscribeToken) . "
                </td>
            </tr>
        </table>
    </body>
    </html>";
}
?>
