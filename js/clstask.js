class Task
{
    constructor(tStart, description, taskId, helpPage)
    {
        this._tStart = tStart;
        this._description = description;
        this._complete = false;
        this._taskId = taskId;
        this._helpPage = helpPage;
        this.updatePgPosition();
        switch(this._pgPosition)
        {
            case -1:
                $("#pendingList").append(this.domHtml);
                break;
            case 0:
                $("#activeList").append(this.domHtml);
                break;
            case 1:
                $("#completeList").append(this.domHtml);
                break;
        }
    }

    get tStart()
    {
        return this._tStart;
    }

    set tStart(x)
    {
        this._tStart = x;
    }

    get taskId()
    {
        return this._taskId;
    }
    
    get description()
    {
        return this._description;
    }

    set description(x)
    {
        this._description = x;
    }

    get complete()
    {
        return this._complete;
    }

    set complete(x)
    {
        this._complete = x;
        this.updateTask();
    }

    get howToPg()
    {
        return this._howToPg;
    }

    set howToPg(x)
    {
        this._howToPg = x;
    }

    get pgPosition()
    {
        this.updatePgPosition();
        return this._pgPosition;
    }

    updatePgPosition()
    {
        var currT = this.getCurrT();
        if(this._complete)
            this._pgPosition = 1;
        else
        {
            if(currT < this._tStart)
                this._pgPosition =  -1;
            else
                this._pgPosition =  0;
        }
        return this._pgPosition;
    }

    get domHtml()
    {
        if(this._helpPage.length > 0)
        {
            var howToLink = $('<span>')
                .text(" - ")
                .append($('<a>')
                    .attr("href", this._helpPage)
                    .attr("target","_blank")
                    .text("show me how")
                )
        }
        else
            var howToLink = "";
        
        var returnObj =  $('<li>')
            .addClass('list-group-item')
            .attr('id',this._taskId)
            //.append($('<div>')
                .addClass('checkbox')
                .append($("<label>")
                    .addClass("active")
                    .append($("<input>")
                        .attr("type","checkbox")
                        .attr("checked",this._complete == true ? "" : $("<input>").attr("checked"))
                        .change({arg: this._taskId}, function(event) {changeCheckBox(event.data.arg)})
                    )
                    .append(
                        "<b>" + this.formatTime(this._tStart) + "</b> - "
                        + this._description)
                    .append(howToLink)
                )
            //)

        return returnObj;
    }

    updateTask()
    {
        var previousPos = this._pgPosition;
        this.updatePgPosition()
        if(previousPos != this._pgPosition)
        {
            $("#" + this.taskId).attr("id","remove");
            $("#remove").hide(400, function(){$("#remove").remove()});
            switch(this._pgPosition)
            {
                case -1:
                    var nextId = getFollowingTaskId(this.tStart, -1);
                    if(nextId >= 0)
                    {
                        $(this.domHtml).insertBefore($("#" + nextId)).hide();
                        $("#" + this.taskId).show(400);
                    }
                    else
                    {
                        $("#pendingList").append($(this.domHtml).hide());
                        $("#" + this.taskId).show(400);
                    }
                    break;
                case 0:
                    var nextId = getFollowingTaskId(this.tStart, 0);
                    if(nextId >= 0)
                    {
                        $(this.domHtml).insertBefore($("#" + nextId)).hide();
                        $("#" + this.taskId).show(400);
                    }
                    else
                    {
                        $("#activeList").append($(this.domHtml).hide());
                        $("#" + this.taskId).show(400);
                    }
                    break;
                case 1:
                    $("#completeList").append($(this.domHtml).hide());
                    $("#" + this.taskId).show(400);
                    break;
            }
        }
    }

    tStartRel(tRef, interval, after)
    {
        if(after)
            tStart = tRef + interval;
        else
            tStart = tRef - interval;
    }

    getCurrT()
    {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        return h * 60 + m;
    }

    formatTime(mins)
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
}