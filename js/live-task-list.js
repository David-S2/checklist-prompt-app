var tasks = [];
var nextKey = 0;

function updateAllTasks()
{
    tasks.forEach(function(task)
    {
        task.updateTask();
    });
}

function changeCheckBox(taskId)
{
    var idx = getTaskIdxFromId(taskId);
    if(tasks[idx].complete)
        tasks[idx].complete = false;
    else
        tasks[idx].complete = true;
}

function getTaskIdxFromId(id)
{
    idx = tasks.map(function(element){return element.taskId}).indexOf(id);
    return idx;
}

function getFollowingTaskId(tStart, listNum)
{
    var tStarts = tasks.map(function(element){
        if(element.pgPosition == listNum)
            return element.tStart
    });
    idx = tStarts.findIndex(function(element){return element > tStart});
    if(idx >= 0)
        return tasks[idx].taskId;
    else
        return -1;
}

function movePendingToActive()
{
    $("#pendingList")
}

function importTasks()
{
    var taskList = JSON.parse(localStorage.taskList);
    for(var i = 0; i < taskList.length; i++)
    {
        tempTask = new Task(
            taskList[i].tStart,
            taskList[i].description,
            getNextKey(),
            taskList[i].helpPage
        );
        tasks.push(tempTask);
    }
}