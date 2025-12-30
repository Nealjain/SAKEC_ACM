<?php
require_once 'config.php';

$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Get single event
        $stmt = $db->prepare("SELECT * FROM events WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    } elseif (isset($_GET['type'])) {
        // Get upcoming or past events
        $today = date('Y-m-d');
        if ($_GET['type'] === 'upcoming') {
            $stmt = $db->prepare("SELECT * FROM events WHERE date > ? ORDER BY date ASC");
        } else {
            $stmt = $db->prepare("SELECT * FROM events WHERE date <= ? ORDER BY date DESC");
        }
        $stmt->execute([$today]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } else {
        // Get all events
        $stmt = $db->query("SELECT * FROM events ORDER BY date DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}
?>
