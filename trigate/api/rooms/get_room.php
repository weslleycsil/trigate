<?php

include_once '../global/cors_get.php';

// get database connection
include_once '../config/database.php';
include_once '../global/utils.php';

// instantiate product object
include_once '../objects/rooms.php';

$database = new Database();
$db = $database->getConnection();

$room_id = $_GET["room_id"];

$room = new Rooms($db);
$room->id = $room_id;
$room_result = $room->get_room();
if ($room_result) {
    $response = $room_result->fetchAll(PDO::FETCH_ASSOC)[0];
    http_response_code(200);
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else {
    $response = array("message" => getMessage("unexpectedError"));
    http_response_code(503);
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
