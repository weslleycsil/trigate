<?php
// required headers
include_once '../global/cors_post.php';

// get database connection
include_once '../config/database.php';
include_once '../global/utils.php';

// instantiate product object
include_once '../objects/login.php';

$database = new Database();
$db = $database->getConnection();

$table_abstraction = new Login($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));

//verificacao de credencial simples do script lsl opensim
if (check_auth_opensim()) {
    $table_abstraction->username = $data->username;
    $table_abstraction->opensim_user = $data->opensimUser;

    $waiting = $table_abstraction->insertOpensimUser();

    if ($waiting) {
        $response = array(
            "message" => "Registro Atualizado com Sucesso!",
            "opensimUser" => $data->opensimUser,
            "username" => $data->username,
        );

        http_response_code(200);
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Something goes wrong!"));
    }

} else {
    http_response_code(401);
}
