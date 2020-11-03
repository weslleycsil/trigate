<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// get database connection
include_once '../config/database.php';
include_once '../global/utils.php';

// instantiate product object
include_once '../objects/rooms.php';

$database = new Database();
$db = $database->getConnection();
$room = new Rooms($db);
$all_rooms = $room->get_rooms();
$user_on_room = $room->get_users_by_room();
if ($all_rooms) {
    $response = array(
        "rooms" => $all_rooms->fetchAll(PDO::FETCH_ASSOC | PDO::FETCH_GROUP),
        "user_by_room" => $user_on_room->fetchAll(PDO::FETCH_ASSOC | PDO::FETCH_GROUP),
    );
    http_response_code(200);
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else {
    $response = array("message" => getMessage("unexpectedError"));
    http_response_code(503);
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
