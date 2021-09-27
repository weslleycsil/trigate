<?php
include_once '../config/settings.php';

function send_email($nickname, $code, $email, $username)
{
    $subject = "[NO-REPLY] Código de Registro Trigate [NO-REPLY]";
    $message = "
        Olá  $nickname,
        <br>
        <br>Você está a 1 passo de se cadastrar no Trigate!
        <br>
        <br>Para finalizar seu cadastro acesse:
        <br>https://www.trigate.generalwebsolutions.com.br//#finishRegister 
        <br>
        <br>Insira seus dados e o código de acesso.
        <br>
        <br>Um lembrete para você! Esses são seus dados:
        <br>Email: $email
        <br>Nome da conta: $username
        <br>Código de acesso: $code
    ";

    $recipient = "contato@trigate.generalwebsolutions.com.br";

    $email_headers = implode("\n", array("From: $recipient", "Reply-To: $recipient", "Return-Path: $recipient", "MIME-Version: 1.0", "X-Priority: 3", "Content-Type: text/html; charset=UTF-8"));
    $mail_flow = mail($email, $subject, $message, $email_headers);
    if ($mail_flow) {
        return true;
    }
    echo var_dump($mail_flow);
    return false;
}
