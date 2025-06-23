<?php
/**
 * Contact Form Handler
 * Handles form submissions with proper validation and security measures
 */

// Configuration
$config = [
    'recipient_email' => 'ebasy22@gmail.com',
    'from_email' => 'noreply@erikasy.com', // Update with your domain
    'from_name' => 'Erika Sy Portfolio',
    'max_message_length' => 5000,
    'rate_limit_file' => '../data/rate_limit.json',
    'rate_limit_max' => 5, // Max submissions per hour per IP
];

// Headers for security
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// CORS headers (adjust origin as needed)
header('Access-Control-Allow-Origin: https://yourdomain.com');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

/**
 * Rate limiting function
 */
function checkRateLimit($config) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $current_time = time();
    $rate_limit_file = $config['rate_limit_file'];
    
    // Create data directory if it doesn't exist
    $data_dir = dirname($rate_limit_file);
    if (!is_dir($data_dir)) {
        mkdir($data_dir, 0755, true);
    }
    
    // Load existing rate limit data
    $rate_data = [];
    if (file_exists($rate_limit_file)) {
        $rate_data = json_decode(file_get_contents($rate_limit_file), true) ?? [];
    }
    
    // Clean old entries (older than 1 hour)
    $rate_data = array_filter($rate_data, function($timestamp) use ($current_time) {
        return ($current_time - $timestamp) < 3600;
    });
    
    // Check current IP submissions
    $ip_submissions = array_filter($rate_data, function($timestamp, $stored_ip) use ($ip, $current_time) {
        return $stored_ip === $ip && ($current_time - $timestamp) < 3600;
    }, ARRAY_FILTER_USE_BOTH);
    
    if (count($ip_submissions) >= $config['rate_limit_max']) {
        return false;
    }
    
    // Add current submission
    $rate_data[$ip . '_' . $current_time] = $current_time;
    
    // Save updated rate limit data
    file_put_contents($rate_limit_file, json_encode($rate_data));
    
    return true;
}

/**
 * Sanitize and validate input
 */
function sanitizeInput($input, $type = 'text') {
    $input = trim($input);
    
    switch ($type) {
        case 'email':
            return filter_var($input, FILTER_SANITIZE_EMAIL);
        case 'text':
        default:
            return htmlspecialchars(strip_tags($input), ENT_QUOTES, 'UTF-8');
    }
}

/**
 * Validate email format
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Check for common spam patterns
 */
function isSpam($name, $email, $message) {
    $spam_patterns = [
        '/\b(viagra|cialis|loan|casino|poker)\b/i',
        '/\b(click here|buy now|limited time)\b/i',
        '/http[s]?:\/\/.*\.tk/i', // Suspicious TLD
        '/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/', // Credit card pattern
    ];
    
    $content = $name . ' ' . $email . ' ' . $message;
    
    foreach ($spam_patterns as $pattern) {
        if (preg_match($pattern, $content)) {
            return true;
        }
    }
    
    return false;
}

/**
 * Log submission for monitoring
 */
function logSubmission($name, $email, $success) {
    $log_entry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'name' => $name,
        'email' => $email,
        'success' => $success,
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ];
    
    $log_file = '../data/contact_log.json';
    $log_dir = dirname($log_file);
    
    // Create data directory if it doesn't exist
    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    
    $existing_logs = [];
    
    if (file_exists($log_file)) {
        $existing_logs = json_decode(file_get_contents($log_file), true) ?? [];
    }
    
    $existing_logs[] = $log_entry;
    
    // Keep only last 1000 entries
    if (count($existing_logs) > 1000) {
        $existing_logs = array_slice($existing_logs, -1000);
    }
    
    file_put_contents($log_file, json_encode($existing_logs, JSON_PRETTY_PRINT));
}

// Main processing
try {
    // Only allow POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }
    
    // Check rate limiting
    if (!checkRateLimit($config)) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many requests. Please try again later.']);
        exit;
    }
    
    // CSRF protection (implement token verification here if needed)
    // if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    //     http_response_code(403);
    //     echo json_encode(['error' => 'Invalid CSRF token']);
    //     exit;
    // }
    
    // Get and sanitize form data
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '', 'email');
    $message = sanitizeInput($_POST['message'] ?? '');
    
    // Validate required fields
    $errors = [];
    
    if (empty($name) || strlen($name) < 2) {
        $errors[] = 'Name must be at least 2 characters long';
    }
    
    if (empty($email) || !validateEmail($email)) {
        $errors[] = 'Please provide a valid email address';
    }
    
    if (empty($message) || strlen($message) < 10) {
        $errors[] = 'Message must be at least 10 characters long';
    }
    
    if (strlen($message) > $config['max_message_length']) {
        $errors[] = 'Message is too long (max ' . $config['max_message_length'] . ' characters)';
    }
    
    // Check for spam
    if (isSpam($name, $email, $message)) {
        $errors[] = 'Message appears to be spam';
    }
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['error' => implode(', ', $errors)]);
        logSubmission($name, $email, false);
        exit;
    }
    
    // Prepare email
    $subject = "New contact from {$name} - Portfolio Website";
    
    $email_content = "New contact form submission:\n\n";
    $email_content .= "Name: {$name}\n";
    $email_content .= "Email: {$email}\n";
    $email_content .= "IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";
    $email_content .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown') . "\n";
    $email_content .= "Timestamp: " . date('Y-m-d H:i:s') . "\n\n";
    $email_content .= "Message:\n{$message}\n";
    
    // Email headers
    $headers = [
        "From: {$config['from_name']} <{$config['from_email']}>",
        "Reply-To: {$name} <{$email}>",
        "Content-Type: text/plain; charset=UTF-8",
        "X-Mailer: PHP/" . phpversion(),
        "X-Priority: 3",
        "MIME-Version: 1.0"
    ];
    
    // Send email
    $mail_sent = mail(
        $config['recipient_email'],
        $subject,
        $email_content,
        implode("\r\n", $headers)
    );
    
    if ($mail_sent) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully.'
        ]);
        logSubmission($name, $email, true);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send email. Please try again later.']);
        logSubmission($name, $email, false);
        
        // Log error for debugging
        error_log("Failed to send contact form email to {$config['recipient_email']}");
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'An unexpected error occurred']);
    error_log("Contact form error: " . $e->getMessage());
    
    if (isset($name) && isset($email)) {
        logSubmission($name ?? '', $email ?? '', false);
    }
}
?>