//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////        SCRIPT Para o envio de mensagens gerais na sala virtual                //////////////////////////
/////////////////////        ele envia automaticamente todas as mensagens do canal para             //////////////////////////
/////////////////////        a sala do chat com a identificação do usuario que as enviou            //////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Variaveis nao editaveis
integer listenHandle;
key http_request_id;

//variaveis editaveis
string URL_CHAT = "https://ufsc3d.inf.ufsc.br:3000/message";

integer salaAula = 101;

//Informações de cor/opacidade do texto
vector RED = < 0.65, 0, 0>;
float OPAQUE = 1.0;

SendChat ( string name, string message )
{
    list json = ["username",name + "", "message", message + "", "chat", salaAula+"","register", "false"];
    http_request_id = llHTTPRequest ( URL_CHAT, 
    [ HTTP_METHOD, "POST", 
    HTTP_MIMETYPE, "application/json",
    HTTP_VERIFY_CERT,TRUE,
    HTTP_VERBOSE_THROTTLE, TRUE,
    HTTP_PRAGMA_NO_CACHE, TRUE ],llList2Json(JSON_OBJECT, json));
}


default
{
    state_entry()
    {
        //texto
        llSetText ( "Para enviar uma mensagem digite /" + salaAula + " seguido de sua mensagem", RED, OPAQUE );

        //ouvir o channel da sala de aula
        listenHandle = llListen(salaAula, "", "", "");
    }

    listen(integer channel, string name, key id, string message)
    {
        //ouviu
        llOwnerSay("Enviando sua mensagem...");
        SendChat ( name, message );
    }

    on_rez(integer start_param)
    {
        llResetScript();
    }

    changed(integer change)
    {
        if (change & CHANGED_OWNER)
        {
            llResetScript();
        }
    }

    http_response ( key request_id, integer status, list metadata, string body )
    {
        if ( request_id != http_request_id )
        {
            return;
        }
 
        llSetText ( body, RED, OPAQUE );
        llOwnerSay("Mensagem Enviada com sucesso!");
        llSetText ( "Para enviar uma mensagem digite /" + salaAula + " seguido de sua mensagem", RED, OPAQUE );
    }
}