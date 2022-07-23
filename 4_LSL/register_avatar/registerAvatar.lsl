//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////        SCRIPT Para o registro do avatar no sistema trigate                    //////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Variaveis nao editaveis
integer listenHandle;
key http_request_id;

//variaveis editaveis
string URL_API = "https://trigate.twcreativs.com.br/api/login/update_opensim.php";
integer register = 779;

//Informações de cor/opacidade do texto
vector RED = < 0.65, 0, 0>;
float OPAQUE = 1.0;

SendRegister ( string name, string username )
{
    list json = ["opensimUser",name + "", "username", username + ""];
    http_request_id = llHTTPRequest ( URL_API, 
    [ HTTP_METHOD, "POST", 
    HTTP_MIMETYPE, "application/json",
    HTTP_VERIFY_CERT,TRUE,
    HTTP_VERBOSE_THROTTLE, TRUE,
    HTTP_PRAGMA_NO_CACHE, TRUE ],llList2Json(JSON_OBJECT, json));
}

--header 'Authorization: Basic b3BlbnNpbTpvcGVuc2lt' \

default
{
    state_entry()
    {
        //texto
        llSetText ( "Para se registrar na plataforma trigate digite /" + register + " seguido do seu username trigate", RED, OPAQUE );

        //ouvir o channel da sala de aula
        listenHandle = llListen(register, "", "", "");
    }

    listen(integer channel, string name, key id, string message)
    {
        //ouviu
        llOwnerSay("Registrando...");
        SendRegister ( name, message );
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
        llOwnerSay("Solicitação de Registro enviada!");
        llSetText ( "Para se registrar na plataforma trigate digite /" + register + " seguido do seu username trigate", RED, OPAQUE );
    }
}