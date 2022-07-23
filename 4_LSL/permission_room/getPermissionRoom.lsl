//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////        SCRIPT Para o buscar se a sala selecionada pode ser acessada           //////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Variaveis nao editaveis
integer listenHandle;
key http_request_id;

//variaveis editaveis
string URL_API = "https://trigate.twcreativs.com.br/api/rooms/get_rooms_by_user_opensim.php";
integer sala = 101;

//Informações de cor/opacidade do texto
vector RED = < 0.65, 0, 0>;
float OPAQUE = 1.0;

Send ( string name )
{
    list json = ["opensimUser",name + "", "chatRoom", sala + ""];
    http_request_id = llHTTPRequest ( URL_API, 
    [ HTTP_METHOD, "POST", 
    HTTP_MIMETYPE, "application/json",
    HTTP_VERIFY_CERT,TRUE,
    HTTP_VERBOSE_THROTTLE, TRUE,
    HTTP_PRAGMA_NO_CACHE, TRUE ],llList2Json(JSON_OBJECT, json));
}

disparaAbertura ()
{
    //aqui vai a regra de jogo para abertura da porta
    //pode ser um script personalizado
}


default
{
    state_entry()
    {
    }

    touch_start(integer total_number)
    {
        string name = llDetectedName(0);
        Send (name);
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
        if ( status == 200 )
        {
            llOwnerSay("Entrada na sala Permitida!");
            disparaAbertura();
        } else {
            llOwnerSay("Entrada nao Permitida");
        }
    }
}