<?php
include_once '../config/settings.php';
include_once 'messages.php';

function tinyIntCast($value)
{
    if (is_numeric($value)) {
        $value = (int) $value;
        $result = ($value == 1 || $value == 0) ? $value : "NULL";
    } else {
        $result = "NULL";
    }

    return $result;
}

function numberOrNullCast($value)
{
    $result = is_numeric($value) ? $value : "NULL";
    return $result;
}

function checkCustomType($type, $value)
{
    global $MESSAGES, $LANGUAGE, $PASSWORD_MIN_SIZE;
    $response = array(
        "result" => false,
        "message" => "Unexpected Error",
    );

    switch ($type) {
        case "cellphone":
            if (empty($value)) {
                $response["message"] = $MESSAGES[$LANGUAGE]["cellPhoneEmpty"];
            } else if (!is_numeric($value) || strlen($value) != 11) {
                $response["message"] = $MESSAGES[$LANGUAGE]["cellPhoneWrongFormat"];
            } else {
                $response["result"] = true;
                $response["message"] = "";
            }
            break;
        case "password":
            if (strlen($value) < $PASSWORD_MIN_SIZE) {
                $response["message"] = $MESSAGES[$LANGUAGE]["passwordShort"];
            } else if (!ctype_alnum($value)) {
                $response["message"] = $MESSAGES[$LANGUAGE]["passwordWrongFormat"];
            } else {
                $response["result"] = true;
                $response["message"] = "";
            }
            break;
    }
    return $response;
}

function checkConsistence($data)
{
    $response = array(
        "result" => true,
        "message" => array(),
    );
    foreach ($data as $key => $element) {
        $checkResult = checkCustomType($element["type"], $element["value"]);
        if (!$checkResult["result"]) {
            $response["result"] = false;
            array_push($response["message"], $checkResult["message"]);
        }
    }

    return $response;
}

function getMessage($msg)
{
    global $MESSAGES, $LANGUAGE;
    return $MESSAGES[$LANGUAGE][$msg];
}

function getAuthorizationHeader()
{
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } else if (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    return $headers;
}

function getBearerToken()
{
    $headers = getAuthorizationHeader();
    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }
    }
    return null;
}

function set_object_vars_to_query($object, $vars)
{
    $query_params = array();
    $query_values = array();
    $query_pair = array();
    $vars = (array) $vars;
    $has = $object->get_unrestricted_vars();
    foreach ($has as $name => $oldValue) {
        if (isset($vars[$name])) {
            $object->$name = $vars[$name];
            $bind_name = "=:" . $name;
            $pair = $name . $bind_name;
            array_push($query_params, $name);
            array_push($query_values, $bind_name);
            array_push($query_pair, $pair);
        }
    }
    $query_pieces = array(
        "parameters" => $query_params,
        "values" => $query_values,
        "pair" => $query_pair,
    );
    return $query_pieces;
}

function create_dir_if_not_exists($PATH)
{
    if (!is_dir($PATH)) {
        mkdir($PATH);
        return true;
    }
    return false;
}

function check_auth_opensim(){
    //'Authorization: Basic b3BlbnNpbTpvcGVuc2lt'
    //futura implementação de cabeçalho de autenticação caso lsl comece a suportar
    /*$headers = getAuthorizationHeader();
    if (!empty($headers)) {
        if (preg_match('/Basic\s(\S+)/', $headers, $matches)) {
            $un_pw = explode(":", base64_decode($matches[1]));
            $user = $un_pw[0];
            $pw = $un_pw[1];
            if($user == "opensim" && $pw == "opensim"){
                return true;
            }
            return false;
        }
    }*/
    return true;
}