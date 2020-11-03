<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/settings.php';
include_once '../global/utils.php';
include_once '../global/token_management.php';

$token = getBearerToken();
try {
    $decoded_token = decodeToken($token);
    $response = array("message" => getMessage("tokenActive"));
    http_response_code(200);
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    $response = array("message" => getMessage("tokenInactive"));
    http_response_code(401);
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
