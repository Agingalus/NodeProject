//import { parse } from "url";

/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

$(document).on("pagebeforeshow ", "#home", function() {
    var info_view = ""; //string to put HTML in
    $("#workDisplay").empty(); // since I do this everytime the page is redone, I need to remove existing before apending them all again
    $.getJSON("./workList/") //Send an AJAX request
        .done(function(data) {
            // make up each li as an <a> to the details-page
            $.each(data, function(index, record) {
                $("#workDisplay").append("<li><a data-parm='" + record.WorkType + "'  href='#details-page'>" + record.WorkType + "</a></li>");
            });


            $("#workDisplay").listview("refresh"); // need this so jquery mobile will apply the styling to the newly added li's

            $("a").on("click", function(event) { // set up an event, if user clicks any, it writes that items data-parm into the details page's html so I can get it there
                var parm = $(this).attr("data-parm");
                //do something here with parameter on  details page
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
            textString = "Name: " + data.Name + "<br> Work Type: " + data.WorkType + "<br> DateEntered: " + timeConverter(data.DateEntered) +
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

// $(document).on("pagebeforeshow", "#deletePage", function() {

//     $("#deleteWorkType").val("");
// });

// function deleteWork() {
//     var work = $("#deleteWorkType").val();
//     $("#deleteWorkType").val("");

//     $.ajax({
//         url: "/deleteWork/" + work,
//         type: "DELETE",
//         contentType: "application/json",
//         success: function(response) {
//             alert("The work successfully deleted in cloud");
//         },
//         error: function(response) {
//             alert("ERROR: Note NOT deleted in cloud");
//         }
//     });
// }

function deleteWorkDetails() {
    // var id = $("#deleteWorkType").val();
    // $("#deleteWorkType").val("");

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
    if (work.PerHour === "") {
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
    //var timestampString = timestamp.toString();

    var newName = $("#newName").val();
    var newWorkType = $("#newWorkType").val();
    var newStart = $("#newStart").val();
    var newEnd = $("#newEnd").val();
    var newTotalTime = $("#newTotalTime").val();
    var newPerHour = $("#newPerHour").val();
    //var newTotalPay = $("#TotalPay").val();
    var newDateWorked = $("#newDateWorked").val();
    var newWork = {
        Name: newName,
        WorkType: newWorkType,
        DateEntered: timestamp, //Date.now(),
        Start: newStart,
        End: newEnd,
        //TotalTime: getTotalTime(newStart, newEnd),
        PerHour: newPerHour,
        //TotalPay: newPerHour * this.TotalTime,
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
    // let theDateEntered = new Date();
    // let stringDate;
    var id = $("#detailParmHere").text();
    $.getJSON("/findWork/" + id)
        .done(function(data) {
            //var parm = $(this).attr("data-parm");
            //do something here with parameter on  details page
            //$("#detailUpdateParmHere").html(parm);

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
                // window.location.href = "#workList";
                //$("#detailParmHere").val(updateWork.WorkType);
            }
        });
    } else {
        alert("NOPE!");
    }



}

function timeConverter(UNIX_timestamp) {
    // if (isNaN(UNIX_timestamp)) {
    //     return "no date";
    // }
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

// function parseTime(fullTime) {



//     let hour = parseInt(fullTime.substring(0, 2));
//     let min = parseInt(fullTime.substring(4, 6));
//     return { hh: hour, mm: min };
// }

// function getTotalTime(start, end) {
//     let startObj = parseTime(start);
//     let endObj = parseTime(end);
//     let totalTime = { hh: 0, mm: 0 };

//     if (endObj.hh < startObj.hh) {
//         endObj.hh += 24;
//     }
//     if (endObj.mm < startObj.mm) {
//         endObj.hh--;
//         endObj.mm += 60;
//     }
//     totalTime.hh = endObj.hh - startObj.hh;
//     totalTime.mm = endObj.mm - startObj.mm;
//     totalTime.mm = totalTime.mm / 60;
//     return totalTime.hh + totalTime.mm;




// }