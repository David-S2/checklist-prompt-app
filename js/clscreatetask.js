class CreateTask
{
    constructor(tStart, description, taskId, helpPage)
    {
        this._tStart = tStart;
        this._description = description;
        this._taskId = taskId;
        this._helpPage = helpPage;
        this.display();
    }

    get taskId()
    {
        return this._taskId;
    }

    get tStart()
    {
        return this._tStart;
    }

    set tStart(x)
    {
        this._tStart = x;
        $("#" + this._taskId).attr("id", "remove");
        $("#remove").hide(400, function(){$("#remove").remove()})
        this.display();
        activeId = this._taskId;
        $('html, body').animate({
            scrollTop: ($("#" + this._taskId).offset().top)
        },500);
        $("#" + this._taskId).hide();
        $("#" + this._taskId).show(401, function(){
            $("#" + activeId + "body").collapse('show');
            $('html, body').animate({
                scrollTop: ($("#" + activeId).offset().top)
            },50);
        });
        storeTaskList();
    }

    get description()
    {
        return this._description;
    }
    
    set description(x)
    {
        this._description = x;
        $("#" + this._taskId + "title")
            .html("<b>" + this.formatTime(this._tStart) + "</b> - " + this._description);
        storeTaskList();
    }

    set helpPage(x)
    {
        this._helpPage = x;
    }

    get helpPage()
    {
        return this._helpPage;
    }

    get domHtml()
    {
        return $('<div>')
            .attr("id", this._taskId)
            .addClass('panel panel-default')
            .append($('<div>')
                .addClass('panel-heading')
                .attr("id", this._taskId + "head")
                .append($('<span>')
                    .attr("id", this._taskId + "title")
                    .append($('<a>')
                        .addClass('btn-block')
                        .attr('data-toggle', 'collapse')
                        .attr('href', "#" + this._taskId + "body")
                        .click({arg1: this._taskId + "btn", arg2: this._taskId + "body"}, function(event){
                            if($("#" + event.data.arg2).is(':visible'))
                                $("#" + event.data.arg1).html("&#9661;");
                            else
                                $("#" + event.data.arg1).html("&#9651;");
                        })
                        .append($('<span>')
                        .attr("style", "width:90%")    
                            .html("<b>" + this.formatTime(this._tStart) + "</b> - " + this._description)
                        )
                        .append($('<span>')
                            .attr("style", "width:10%")
                            .addClass("pull-right text-right")
                            .attr('id', this._taskId + "btn")
                            .html("&#9661;")
                        )
                    )
                )
            )
            .append($('<div>')
                .addClass('panel-collapse collapse')
                .attr('id', this._taskId + "body")
                .append($('<div>')
                    .addClass('panel-body')
                    .append($('<form>')
                        .append($('<div>')
                            .addClass("form-group row")
                            .append($('<label>')
                                .addClass("col-form-label col-lg-2 col-md-2 col-sm-2 col-xs-2")
                                .attr("for", this._taskId + "time")
                                .text("Time:")
                            )
                            .append($('<div>')
                                .addClass("col-lg-10 col-md-10 col-sm-10 col-xs-10")
                                .append($('<input>')
                                    .addClass("form-control")
                                    .attr("id", this._taskId + "time")
                                    .attr("type", "time")
                                    .val(this.formatTime(this._tStart))
                                    .blur({arg: this._taskId}, function(event){
                                        changeTime(event.data.arg)
                                    })
                                )
                                .append($('<div>')
                                    .addClass("text-danger")
                                    .attr("id", this._taskId + "err_time")
                                )
                            )
                        )
                        .append($('<div>')
                            .addClass("form-group row")
                            .append($('<label>')
                                .addClass("col-form-label col-lg-2 col-md-2 col-sm-3 col-xs-4")
                                .attr("for", this._taskId + "description")
                                .text("Description:")
                            )
                            .append($('<div>')
                                .addClass("col-lg-10 col-md-10 col-sm-9 col-xs-8")
                                .append($('<input>')
                                    .addClass("form-control")
                                    .attr("id", this._taskId + "description")
                                    .attr("type", "text")
                                    .val(this._description)
                                    .blur({arg: this._taskId}, function(event){
                                        changeDescription(event.data.arg)
                                    })
                                )
                                .append($('<div>')
                                    .addClass("text-danger")
                                    .attr("id", this._taskId + "err_desc")
                                )
                            )
                        )
                        .append($('<div>')
                            .addClass("form-group row")
                            .append($('<label>')
                                .addClass("col-form-label col-lg-2 col-md-2 col-sm-3 col-xs-4")
                                .attr("for", this._taskId + "howTo")
                                .text("How-to page:")
                            )
                            .append($('<div>')
                                .addClass("col-lg-10 col-md-10 col-sm-9 col-xs-8")
                                .append($('<input>')
                                    .attr("type", "text")
                                    .addClass("form-control")
                                    .attr("id", this._taskId + "howTo")
                                    .val(this._helpPage)
                                    .blur({arg: this._taskId}, function(event){
                                        changeHowTo(event.data.arg)
                                    })
                                )
                            )
                        )
                        .append($('<button>')
                            .addClass("btn btn-danger")
                            .text("Delete Task")
                            .attr("type", "button")
                            .click({arg: this._taskId}, function(event){
                                deleteTask(event.data.arg)
                            })
                        )
                    )
                )
            )
    }

    display()
    {
        var nextId = getFollowingTaskId(this._tStart);
        if(nextId >= 0)
            $(this.domHtml).insertBefore($("#" + nextId));
        else
            $("#mainDiv").append($(this.domHtml));
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