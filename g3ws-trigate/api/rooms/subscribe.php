<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get database connection
include_once '../config/settings.php';
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
    $data = json_decode(file_get_contents("php://input"));

    $room = new Rooms($db);
    $room->user = $decoded_token->userUniqueId;
    $room->room = $data->room_id;
    $query_status = $room->subscribe();
    if ($query_status) {
        $response = array("message" => getMessage("genericSuccess"));
        http_response_code(200);
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    } else {
        $response = array("message" => getMessage("genericFailure"));
        http_response_code(503);
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    }

} catch (Exception $e) {
    $response = array("message" => getMessage("tokenInactive"));
    http_response_code(401);
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
