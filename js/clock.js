var currT;

//Adapted from https://www.w3schools.com/js/tryit.asp?filename=tryjs_timing_clock
function startTime()
{
    var today = new Date();

    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = addZero(m);
    s = addZero(s);
    document.getElementById('clock').innerHTML = h + ":" + m + ":" + s;
    if(h * 60 + m != currT)
    {
        currT = h * 60 + m;
        updateAllTasks();
    }
    setTimeout(startTime, 500);
}

//Adds zero infront of time if less than 10
function addZero(i) {
    if (i < 10)
        i = "0" + i;
    return i;
}