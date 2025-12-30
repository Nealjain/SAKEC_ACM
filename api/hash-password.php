<?php
// Helper script to generate password hashes for admin users
// Usage: php hash-password.php "YourPassword123"

if (php_sapi_name() !== 'cli') {
    die('This script can only be run from command line');
}

if ($argc < 2) {
    echo "Usage: php hash-password.php \"YourPassword\"\n";
    exit(1);
}

$password = $argv[1];
$hash = password_hash($password, PASSWORD_BCRYPT);

echo "\nPassword: $password\n";
echo "Hash: $hash\n\n";
echo "Use this hash in your SQL INSERT statement:\n";
echo "INSERT INTO admins (username, password_hash, email) VALUES ('username', '$hash', 'email@example.com');\n\n";
