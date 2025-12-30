<?php
require_once 'config.php';

$db = getDB();

// Get all team members
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Get single member
        $stmt = $db->prepare("SELECT * FROM team_members WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $member = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($member) {
            // Parse JSON fields
            if ($member['skills']) $member['skills'] = json_decode($member['skills']);
            if ($member['achievements']) $member['achievements'] = json_decode($member['achievements']);
            echo json_encode($member);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Member not found']);
        }
    } else {
        // Get all members
        $stmt = $db->query("SELECT * FROM team_members ORDER BY display_order ASC");
        $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Parse JSON fields for each member
        foreach ($members as &$member) {
            if ($member['skills']) $member['skills'] = json_decode($member['skills']);
            if ($member['achievements']) $member['achievements'] = json_decode($member['achievements']);
        }
        
        echo json_encode($members);
    }
}
?>
