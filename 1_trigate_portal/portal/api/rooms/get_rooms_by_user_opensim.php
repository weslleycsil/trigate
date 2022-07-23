<?php

include_once '../global/cors_post.php';

// get database connection
include_once '../config/database.php';
include_once '../global/utils.php';

// instantiate product object
include_once '../objects/rooms.php';

$database = new Database();
$db = $database->getConnection();

$room = new Rooms($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));

//verificacao de credencial simples do script lsl opensim
if (check_auth_opensim()) {
    $opensimUser = $data->opensimUser;
    $chatRoom = $data->chatRoom;
    $all_rooms = $room->get_user_rooms_opensim($data->opensimUser);
    if ($all_rooms) {
        $rooms = $all_rooms->fetchAll(PDO::FETCH_COLUMN);
        if (in_array($chatRoom, $rooms)) { 
            $response = array("message" => "Room Permit!");
            http_response_code(200);
            echo json_encode($response, JSON_UNESCAPED_UNICODE);
        } else {
            $response = array("message" => "Room Denied!");
            http_response_code(401);
            echo json_encode($response, JSON_UNESCAPED_UNICODE);
        }
        
    } else {
        $response = array("message" => getMessage("unexpectedError"));
        http_response_code(503);
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(401);
}