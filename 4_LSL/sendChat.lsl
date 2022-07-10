//Variaveis nao editaveis
key REQUEST_KEY;
integer listenHandle;

//variaveis editaveis
string URL_CHAT = "";
integer salaAula = 0;




//Informações de cor/opacidade do texto
vector BLUE = < 0.0, 0.5, 1.0>;
float OPAQUE = 1.0;


default {
    state_entry()
    {
        //texto
        llSetText ( "Clique para entrar na Sala", BLUE, OPAQUE );

        //ouvir o channel da sala de aula
        listenHandle = llListen(0, "", llGetOwner(), "");
    }

    listen(integer channel, string name, key id, string message)
    {
        //ouviu
    }

    touch_start ( integer num_detected )
    {
        //tocou
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
}