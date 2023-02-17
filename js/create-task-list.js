var activeId = "";

$(document).ready(function(){
    jQuery.noConflict();
    $('#startModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    $("#stdLiv").click(function(){
        $('#startModal').modal('hide');
        defaultTimingsLivePreach();
    });

    $("#stdVid").click(function(){
        $('#startModal').modal('hide');
        defaultTimingsVideoPreach();
    });

    $("#sumLiv").click(function(){
        $('#startModal').modal('hide');
        summerTimingsLivePreach();
    });

    $("#sumVid").click(function(){
        $('#startModal').modal('hide');
        summerTimingsVideoPreach();
    });

    $("#newList").click(function(){
        $('#startModal').modal('hide');
    });

    $("#prevList").click(function(){
        $('#startModal').modal('hide');
        previousList();
    });

    $("#addAction").click(function(){
        var valid = inputValidity("#newTime", "#err_time", "#newDesc", "#err_desc");
        if(valid)
        {
            newTaskObj();
            $('#newAction').modal('hide');
            $("#newTime").val(""),
            $("#newDesc").val(""),
            $("#newHelp").val("")
            storeTaskList();
        }
    });

    $("#complete").click(function(){
        storeTaskList();
        window.location.href = "live-task-list.html"
    });
});

function inputValidity(timeInput, err_time, descInput, err_desc)
{
    var valid = true
    if($(timeInput).val() == "")
    {
        $(err_time).text("Time is required");
        valid = false;
    }
    else
        $(err_time).text("");
    if($(descInput).val() == "")
    {
        $(err_desc).text("Description is required");
        valid = false;
    }
    else
        $(err_desc).text("");
    return valid;
}

function newTaskObj()
{
    tempTask = new CreateTask(
        timeStrToInt($("#newTime").val()),
        $("#newDesc").val(),
        getNextKey(),
        $("#newHelp").val()
    );
    tasks.push(tempTask);
    storeTaskList();
}

function timeStrToInt(time_str)
{
    var pos = time_str.search(":");
    var hr = parseInt(time_str.slice(0, pos));
    var min = parseInt(time_str.slice(3, time_str.length));
    return hr * 60 + min;
}

function changeTime(taskId)
{
    var idx = getTaskIdxFromId(taskId);
    var valid = inputValidity(
        "#" + taskId + "time",
        "#" + taskId + "err_time",
        "#" + taskId + "description",
        "#" + taskId + "err_desc"
    );
    if(valid)
    {
        time_int = timeStrToInt($("#" + taskId + "time").val());
        tasks[idx].tStart = time_int;
    }
    else
        $("#" + taskId + "time").val(formatTime(tasks[idx].tStart));
}

function changeDescription(taskId)
{
    var idx = getTaskIdxFromId(taskId);
    var valid = inputValidity(
        "#" + taskId + "time",
        "#" + taskId + "err_time",
        "#" + taskId + "description",
        "#" + taskId + "err_desc"
    );
    if(valid)
    {
        time_int = timeStrToInt($("#" + taskId + "time").val());
        tasks[idx].description = $("#" + taskId + "description").val();
    }
    else
        $("#" + taskId + "description").val(tasks[idx].description);
}

function changeHowTo(taskId)
{
    var idx = getTaskIdxFromId(taskId);
    tasks[idx].helpPage = $("#" + taskId + "howTo").val();
}

function getTaskIdxFromId(id)
{
    var idx = tasks.map(function(element){return element.taskId}).indexOf(id);
    return idx;
}

function formatTime(mins)
{
    var h = Math.floor(mins/60);
    if(h < 10)
        var returnVal = "0" + h + ":";
    else
        var returnVal = h + ":";
    var m = mins % 60;
    if(m < 10)
        returnVal = returnVal + "0" + m;
    else
        returnVal = returnVal + m;
    return returnVal;
}

function getFollowingTaskId(tStart)
{
    var tStarts = tasks.map(function(element){return element.tStart});
    idx = tStarts.findIndex(function(element){return element > tStart});
    if(idx >= 0)
        return tasks[idx].taskId;
    else
        return -1;
}

function deleteTask(id)
{
    $("#" + id).attr("id", "remove");
    $("#" + id + "body").collapse();
    $("#remove").hide(400, function(){$("#remove").remove()});
    var idx = getTaskIdxFromId(id);
    tasks.splice(idx, 1);
    storeTaskList();
}

function storeTaskList()
{
    var taskList = tasks.map(function(element){
        return {
            tStart: element.tStart,
            description: element.description,
            helpPage: element.helpPage
        }
    });
    localStorage.taskList = JSON.stringify(taskList);
    console.log(localStorage.taskList);
}

function previousList()
{
    tasks = [];
    var taskList = JSON.parse(localStorage.taskList);
    for(var i = 0; i < taskList.length; i++)
    {
        tempTask = new CreateTask(
            taskList[i].tStart,
            taskList[i].description,
            getNextKey(),
            taskList[i].helpPage
        );
        tasks.push(tempTask);
    }
}