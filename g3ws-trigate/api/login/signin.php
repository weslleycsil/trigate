<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get database connection
include_once '../config/database.php';
include_once '../global/utils.php';
include_once '../global/token_management.php';

// instantiate product object
include_once '../objects/login.php';

$database = new Database();
$db = $database->getConnection();
$table_abstraction = new Login($db);

$data = json_decode(file_get_contents("php://input"));

if ($data->username && $data->password) {
    $table_abstraction->username = $data->username;
    $table_abstraction->password = $data->password;

    $waiting = $table_abstraction->signin();
    $result = $waiting->fetchAll(PDO::FETCH_ASSOC);
    $loginSize = count($result);

    if ($waiting && $loginSize == 1) {
        $userUniqueId = $result[0]["id"];
        $adminLevel = $result[0]["admin"];

        if ($adminLevel == 1) {
            $token = generateAdminToken($userUniqueId);
            $response = array(
                "message" => getMessage("successfulAdminLogin"),
                "token" => $token,
            );
        } else {
            $token = generateToken($userUniqueId);
            $response = array(
                "message" => getMessage("successfulLogin"),
                "userUniqueId" => $userUniqueId,
                "token" => $token,
            );
        }
        http_response_code(200);
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    } else if ($loginSize == 0) {
        $response["message"] = getMessage("wrongLogin");
        http_response_code(401);
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    } else {
        $response["message"] = getMessage("unexpectedError");
        http_response_code(503);
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    }
} else {
    $response["message"] = getMessage("missingParameters");
    http_response_code(503);
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
