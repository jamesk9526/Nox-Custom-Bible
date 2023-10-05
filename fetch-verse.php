<?php
// Load WordPress environment
require_once($_SERVER['DOCUMENT_ROOT'] . '/wp-load.php');

// Check if the reference key is set in the GET request
if (isset($_GET['reference'])) {
    $reference = $_GET['reference'];

    // Split the reference into book, chapter, and verse using a regular expression
    $parts = preg_split('/[\s:.]/', $reference);
    
    if (count($parts) >= 3) {
        $book = $parts[0];
        $chapter = $parts[1];
        $verse_parts = explode('-', $parts[2]);

        // SQLite database file path (relative to the plugin folder)
        $db_path = plugin_dir_path(__FILE__) . 'bible.db';

        try {
            // Connect to the SQLite database
            $pdo = new PDO("sqlite:$db_path");
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Prepare and execute a SQL query to retrieve the verse
            if (count($verse_parts) > 1) {
                // Handle verse range
                $verse_start = $verse_parts[0];
                $verse_end = $verse_parts[1];
                $query = "SELECT GROUP_CONCAT(VText, ' ') as VText FROM Bible WHERE BookName = :book AND Chapter = :chapter AND Verse BETWEEN :verse_start AND :verse_end";
                $stmt = $pdo->prepare($query);
                $stmt->bindParam(':verse_start', $verse_start, PDO::PARAM_INT);
                $stmt->bindParam(':verse_end', $verse_end, PDO::PARAM_INT);
            } else {
                // Handle single verse
                $verse = $verse_parts[0];
                $query = "SELECT VText FROM Bible WHERE BookName = :book AND Chapter = :chapter AND Verse = :verse";
                $stmt = $pdo->prepare($query);
                $stmt->bindParam(':verse', $verse, PDO::PARAM_INT);
            }

            $stmt->bindParam(':book', $book, PDO::PARAM_STR);
            $stmt->bindParam(':chapter', $chapter, PDO::PARAM_INT);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                echo $result['VText'];
            } else {
                echo 'Verse not found.';
            }

            // Close the database connection
            $pdo = null;
        } catch (PDOException $e) {
            die('Database connection failed: ' . $e->getMessage());
        }
    } else {
        echo 'Invalid reference format.';
    }
} else {
    echo 'No reference provided.';
}
?>
