<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- Basic setup ---
    $upload_dir = __DIR__ . "/uploads/"; // absolute path for reliability
    $log_file   = __DIR__ . "/upload_log.txt"; // debug log file

    // --- Helper for logging ---
    function log_message($msg, $log_file) {
        $timestamp = date("Y-m-d H:i:s");
        file_put_contents($log_file, "[$timestamp] $msg\n", FILE_APPEND);
    }

    // --- Ensure uploads folder exists ---
    if (!is_dir($upload_dir)) {
        if (!mkdir($upload_dir, 0777, true)) {
            log_message("Failed to create uploads folder at: $upload_dir", $log_file);
            echo json_encode(["status" => "error", "message" => "Server error: cannot create uploads folder."]);
            exit;
        } else {
            log_message("Uploads folder created at: $upload_dir", $log_file);
        }
    }

    // --- Collect form data ---
    $name = htmlspecialchars($_POST["name"] ?? "");
    $email = htmlspecialchars($_POST["email"] ?? "");
    $phone = htmlspecialchars($_POST["phone"] ?? "");
    $position = htmlspecialchars($_POST["position"] ?? "");
    $message = htmlspecialchars($_POST["message"] ?? "");

    log_message("Received application from $name ($email) for position: $position", $log_file);

    // --- File upload handling ---
    $cv_file = "";
    if (isset($_FILES["cv"]) && $_FILES["cv"]["error"] == 0) {
        $file_name = time() . "_" . basename($_FILES["cv"]["name"]);
        $target_path = $upload_dir . $file_name;

        log_message("Attempting to move uploaded file from {$_FILES["cv"]["tmp_name"]} to $target_path", $log_file);

        if (move_uploaded_file($_FILES["cv"]["tmp_name"], $target_path)) {
            $cv_file = $target_path;
            log_message("File uploaded successfully: $target_path", $log_file);
        } else {
            $error_code = $_FILES["cv"]["error"];
            log_message("move_uploaded_file() failed. PHP upload error code: $error_code", $log_file);
            echo json_encode(["status" => "error", "message" => "Failed to upload CV. Check upload_log.txt for details."]);
            exit;
        }
    } else {
        $err = $_FILES["cv"]["error"] ?? "no file";
        log_message("No CV uploaded or upload error ($err)", $log_file);
    }

    // --- Email sending ---
    $to = "hr@calculusai.tech"; // ⚠️ Replace with your real email
    $subject = "New Job Application - $position";
    $body = "
        <h2>New Job Application Received</h2>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Phone:</strong> {$phone}</p>
        <p><strong>Position:</strong> {$position}</p>
        <p><strong>Message:</strong><br>{$message}</p>
    ";

    $headers = "From: {$email}\r\n";
    $headers .= "Reply-To: {$email}\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"boundary\"\r\n";

    $message_body = "--boundary\r\n";
    $message_body .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
    $message_body .= $body . "\r\n";

    if ($cv_file && file_exists($cv_file)) {
        $file_data = chunk_split(base64_encode(file_get_contents($cv_file)));
        $file_name = basename($cv_file);
        $message_body .= "--boundary\r\n";
        $message_body .= "Content-Type: application/octet-stream; name=\"{$file_name}\"\r\n";
        $message_body .= "Content-Disposition: attachment; filename=\"{$file_name}\"\r\n";
        $message_body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $message_body .= $file_data . "\r\n";
    }

    $message_body .= "--boundary--";

    if (mail($to, $subject, $message_body, $headers)) {
        log_message("Mail successfully sent to $to", $log_file);
        echo json_encode(["status" => "success", "message" => "Application submitted successfully!"]);
    } else {
        log_message("Mail sending failed", $log_file);
        echo json_encode(["status" => "error", "message" => "Application saved, but email sending failed."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
}
?>
