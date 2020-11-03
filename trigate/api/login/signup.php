<?php
// required headers
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
include_once '../objects/pending_login.php';

$database = new Database();
$db = $database->getConnection();

$table_abstraction = new Login($db);
$pending_login = new Peding_Login($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));

$pending_login->username = $data->username;
$pending_login->password = $data->password;
$pending_login->secret_code = $data->code;

$check_code_credential = $pending_login->check_avaiable()->fetchAll(PDO::FETCH_ASSOC);
if (count($check_code_credential) == 1) {
    $fetch_result = $check_code_credential[0];
    $checking_uniquiness = false;
    do {
        $uniqueIdGenerated = rand() . $data->username . rand() . $data->password . rand();
        $uniqueIdGenerated = str_shuffle($uniqueIdGenerated);
        $uniqueIdGenerated = uniqid($uniqueIdGenerated, true);
        $uniqueIdGenerated = str_replace(".", "", $uniqueIdGenerated);
        $uniqueIdGenerated = substr($uniqueIdGenerated, 0, 49);
        $checking_uniquiness = $table_abstraction->checkUniqueness($uniqueIdGenerated);
    } while (!$checking_uniquiness && strlen($uniqueIdGenerated) != 50);

    $table_abstraction->nickname = $fetch_result["nickname"];
    $table_abstraction->username = $fetch_result["username"];
    $table_abstraction->password = $fetch_result["password"];
    $table_abstraction->email = $fetch_result["email"];
    $table_abstraction->userUniqueId = $uniqueIdGenerated;
    $table_abstraction->admin = 0;

    $waiting = $table_abstraction->signup();

    if ($waiting) {
        $pending_login->discard_pending();
        $token = generateToken($uniqueIdGenerated);
        $response = array(
            "userUniqueId" => $uniqueIdGenerated,
            "token" => $token,
        );

        http_response_code(200);
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Something goes wrong!"));
    }

} else {
    http_response_code(400);
    echo json_encode(array("message" => "Dados incorretos!"));
}
