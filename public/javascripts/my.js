/* eslint-disable indent */
//import { parse } from "url";

/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

$(document).on("pagebeforeshow ", "#home", function() {

    $("#workDisplay").empty();
    $.getJSON("./workList/")
        .done(function(data) {

            $.each(data, function(index, record) {
                $("#workDisplay").append("<li><a data-parm='" + record.WorkType + "'  href='#details-page'>" + record.WorkType + "</a></li>");
            });


            $("#workDisplay").listview("refresh");

            $("a").on("click", function(event) {
                var parm = $(this).attr("data-parm");

                $("#detailParmHere").html(parm);

            });

        }); // end of .done

});


$(document).on("pagebeforeshow", "#details-page", function() {
    // sting will only say "fix me" if error happened
    var textString = "fix me";

    var id = $("#detailParmHere").text();
    $.getJSON("/findWork/" + id)
        .done(function(data) {
            //all of the data in the item
            textString = "Name: " + data.Name + "<br> Work Type: " + data.WorkType + "<br> Date Entered: " + timeConverter(data.DateEntered) +
                "<br> Start: " + data.Start +
                "<br> End: " + data.End +
                "<br> Total Time: " + data.TotalTime.toFixed(2) +
                "<br> Per Hour: " + data.PerHour +
                "<br> Total Pay: $" + data.TotalPay.toFixed(2) +
                "<br> Date Worked: " + data.DateWorked;
            $("#showdata").html(textString);

        })
        .fail(function(jqXHR, textStatus, err) {
            textString = "Sorry! Could not find it :(";
            $("#showdata").text(textString);
        });



});



function deleteWorkDetails() {


    var id = $("#detailParmHere").text();
    $.ajax({
        url: "/deleteWork/" + id,
        type: "DELETE",
        contentType: "application/json",
        // success: function(response) {
        //     alert("The work successfully deleted in cloud");
        // },
        // error: function(response) {
        //     alert("ERROR: Note NOT deleted in cloud");
        // }
    });
}

// clears the fields
$(document).on("pagebeforeshow", "#addPage", function() {
    $("#newName").val("");
    $("#newWorkType").val("");
    $("#newDateEntered").val("");
    $("#newStart").val("");
    $("#newEnd").val("");
    $("#newTotalTime").val("");
    $("#newPerHour").val("");
    $("#newTotalPay").val("");
    $("#newDateWorked").val("");

});

function validData(work) {

    if (work.Name === "") {
        return false;

    }
    if (work.WorkType === "") {
        return false;

    }
    if (work.Start === "") {
        return false;

    }
    if (work.End === "") {
        return false;

    }
    if (work.PerHour === "" || isNaN(work.PerHour)) {
        return false;

    }
    if (work.DateWorked === "") {
        return false;

    }
    return true;
}




function addItem() {
    var date = new Date();
    var timestamp = date.getTime();


    var newName = $("#newName").val();
    var newWorkType = $("#newWorkType").val();
    var newStart = $("#newStart").val();
    var newEnd = $("#newEnd").val();

    var newPerHour = $("#newPerHour").val();

    var newDateWorked = $("#newDateWorked").val();
    var newWork = {
        Name: newName,
        WorkType: newWorkType,
        DateEntered: timestamp,
        Start: newStart,
        End: newEnd,
        PerHour: newPerHour,
        DateWorked: newDateWorked

    };


    if (validData(newWork)) {

        $("#newName").val("");
        $("#newWorkType").val("");
        $("#newDateEntered").val("");
        $("#newStart").val("");
        $("#newEnd").val("");
        $("#newTotalTime").val("");
        $("#newPerHour").val("");
        $("#newTotalPay").val("");
        $("#newDateWorked").val("");

        $.ajax({
            url: "/addWork/",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(newWork)
        });

    } else {
        alert("NOPE!");
    }

}
$(document).on("pagebeforeshow", "#updatePage", function() {

    var textString = "fix me";

    var id = $("#detailParmHere").text();
    $.getJSON("/findWork/" + id)
        .done(function(data) {

            $("#updateName").val(data.Name);
            $("#updateWorkType").val(data.WorkType);
            $("#updateDateEntered").val(data.DateEntered);
            $("#updateStart").val(data.Start);
            $("#updateEnd").val(data.End);
            $("#updateTotalTime").val(data.TotalTime);
            $("#updatePerHour").val(data.PerHour);
            $("#updateTotalPay").val(data.TotalPay);
            $("#updateDateWorked").val(data.DateWorked);


        })
        .fail(function(jqXHR, textStatus, err) {
            textString = "Sorry! Could not find it :(";
            $("#showdata").text(textString);
        });



});


function updateItem() {
    var id = $("#detailParmHere").text();


    var updateName = $("#updateName").val();
    var updateWorkType = $("#updateWorkType").val();
    var updateStart = $("#updateStart").val();
    var updateEnd = $("#updateEnd").val();

    var updatePerHour = $("#updatePerHour").val();

    var updateDateWorked = $("#updateDateWorked").val();
    var updateWork = {
        Name: updateName,
        WorkType: updateWorkType,
        Start: updateStart,
        End: updateEnd,
        PerHour: updatePerHour,
        DateWorked: updateDateWorked

    };





    if (validData(updateWork)) {
        $("#detailParmHere").html(updateWork.WorkType);
        $("#updateName").val("");
        $("#updateWorkType").val("");
        $("#updateDateEntered").val("");
        $("#updateStart").val("");
        $("#updateEnd").val("");
        $("#updateTotalTime").val("");
        $("#updatePerHour").val("");
        $("#updateTotalPay").val("");
        $("#updateDateWorked").val("");
        $.ajax({
            url: "/updateWork/" + id,
            type: "PUT",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(updateWork),
            success: function(result) {
                //alert("success");

            }
        });
    } else {
        alert("NOPE!");
    }



}

function timeConverter(UNIX_timestamp) {


    var a = new Date(UNIX_timestamp); //* 1000);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    // var hour = a.getHours();
    // var min = a.getMinutes();
    // var sec = a.getSeconds();
    var time = date + " " + month + " " + year; //+ " " + hour + ":" + min + ":" + sec;
    return time;
}