<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

function getImagesFromDir($dir) {
    if (!is_dir($dir)) {
        error_log("Directory not found: " . $dir);
        return [];
    }
    
    $images = glob($dir . "*.{jpg,jpeg,png,gif}", GLOB_BRACE);
    error_log("Found images in $dir: " . print_r($images, true));
    
    return array_map(function($path) {
        return str_replace($_SERVER['DOCUMENT_ROOT'], '', $path);
    }, $images);
}

$type = isset($_GET['type']) ? $_GET['type'] : '';
$images = [];

if ($type === 'garden') {
    $dir = $_SERVER['DOCUMENT_ROOT'] . '/images/garden/';
    error_log("Looking for garden images in: " . $dir);
    $images = getImagesFromDir($dir);
} elseif ($type === 'pets') {
    $dir = $_SERVER['DOCUMENT_ROOT'] . '/images/pets/';
    error_log("Looking for pet images in: " . $dir);
    $images = getImagesFromDir($dir);
}

error_log("Returning images: " . print_r($images, true));
echo json_encode($images); 