float gap = 15.0;
float counter = 0.0;
integer switch = 0;

default
{
    state_entry()
    {
        // Activate the timer listener every 60 seconds
        //llSetTimerEvent(gap);
    }

    touch_start(integer total_number)
    {
        
        if(switch){
            llSay(0, "The timer stops.");
            llSetTimerEvent(0.0);
            switch = 0;
        } else {
            llSay(0, "The timer start.");
            llSetTimerEvent(gap);
            switch = 1;
        }
        
        counter = 0;
    }

    timer()
    {
        //  do a 10m spherical sweep
        llSensor("", NULL_KEY, AGENT_BY_LEGACY_NAME, 10.0, PI);
        counter = counter + gap; 
        llSay(0, (string)counter+" seconds have passed");
    }
    
    sensor (integer num_detected)
    {
        string message = "Detected " + (string)num_detected + " avatar(s): " + llDetectedName(0);

        //we already added the first avatar above, so continue from index 1
        integer index = 1;
        while (index < num_detected)
            message += ", " + llDetectedName(index++);

        llWhisper(PUBLIC_CHANNEL, message);
    }

    no_sensor()
    {
        llWhisper(PUBLIC_CHANNEL, "Nobody is near me at present.");
    }
}