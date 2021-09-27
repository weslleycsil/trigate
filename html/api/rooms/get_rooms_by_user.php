<?php

include_once '../global/cors_get.php';

// get database connection
include_once '../config/database.php';
include_once '../global/utils.php';
include_once '../global/token_management.php';

// instantiate product object
include_once '../objects/rooms.php';

$token = getBearerToken();
try {
    $decoded_token = decodeToken($token);
    $database = new Database();
    $db = $database->getConnection();
    $room = new Rooms($db);
    $all_rooms = $room->get_user_rooms($decoded_token->userUniqueId);
    if ($all_rooms) {
        $response = $all_rooms->fetchAll(PDO::FETCH_COLUMN);
        http_response_code(200);
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    } else {
        $response = array("message" => getMessage("unexpectedError"));
        http_response_code(503);
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $e) {
    $response = array("message" => getMessage("tokenInactive"));
    http_response_code(401);
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
