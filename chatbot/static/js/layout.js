var prev_message = '';
var bot_message_id = 0;
var chart_data = [['Title 0'], ['Title 1']];
var chart_title = 'test';


function drawPieChart() {
    var options = {
        'title': chart_title,
        'width': 410,
        'height': '110%'
    };
    var chart = new google.visualization.PieChart(document.getElementById("msg" + bot_message_id));
    chart.draw(chart_data, options);
}

function drawDonutChart() {
    var options = {
        'title': chart_title,
        'width': 410,
        'height': '110%',
        pieHole: 0.4
    };
    var chart = new google.visualization.PieChart(document.getElementById("msg" + bot_message_id));
    chart.draw(chart_data, options);
}

function drawLineChart() {
    var options = {
        'title': chart_title,
        'width': 410,
        pointsVisible: true,
        'height': '110%',
        'legend': {
            'position': "none"
        }
    };
    var chart = new google.visualization.LineChart(document.getElementById("msg" + bot_message_id));
    chart.draw(chart_data, options);
}

function drawBarChart() {
    var options = {
        'title': chart_title,
        'width': 400,
        'height': '120%',
        'legend': {
            'position': "none"
        },
        vAxis: {
            format: 'short'
        }
    };
    var chart = new google.visualization.BarChart(document.getElementById("msg" + bot_message_id));
    chart.draw(chart_data, options);
}

function drawTable() {
    var cssClassNames = {
        'oddTableRow': 'odd-row'
    };
    var options = {
        'title': chart_title,
        'cssClassNames': cssClassNames,
        vAxis: {
            format: 'short'
        },
        legend: 'none'
    };
    var chart = new google.visualization.Table(document.getElementById("msg" + bot_message_id));
    chart.draw(chart_data, options);
}

function showHideCustomMsg(id) {
    content = document.getElementById('customMsg' + id);
    if (content.style.display === 'none') {
        content.style.display = 'block'
    } else {
        content.style.display = 'none'
    }
}

function drawCustomHeadingTables(data) {
    var purchaseOrderHeaderData = data.PurchaseOrderHeader.value;
    var bot_message = '<button class="collapsible" onclick="showHideCustomMsg(' + bot_message_id + ')">PurchaseOrderID: ' +
        purchaseOrderHeaderData.PurchaseOrderID + '</button><li class="other"><div class="msg" id="customMsg' + bot_message_id + '" ' +
        'style="display: none">';
    bot_message += '<div class="container" id="PurchaseOrderHeaderDiv"><h3 class="text-center">PurchaseOrderHeader</h3>' +
        '<div class="row">' +
        '<div class="col-xs-4">PurchaseOrderID: ' + purchaseOrderHeaderData.PurchaseOrderID + '</div>' +
        '<div class="col-xs-4">EmployeeName: ' + purchaseOrderHeaderData.EmployeeName + '</div>' +
        '<div class="col-xs-4">JobTitle: ' + purchaseOrderHeaderData.JobTitle + '</div>' +
        '</div><div class="row">' +
        '<div class="col-xs-4">DepartmentName: ' + purchaseOrderHeaderData.DepartmentName + '</div>' +
        '<div class="col-xs-4">VendorAccountNumber: ' + purchaseOrderHeaderData.VendorAccountNumber + '</div>' +
        '<div class="col-xs-4">VendorName: ' + purchaseOrderHeaderData.VendorName + '</div>' +
        '</div><div class="row">' +
        '<div class="col-xs-4">VendorCreditRating: ' + purchaseOrderHeaderData.VendorCreditRating + '</div>' +
        '<div class="col-xs-4">ShipMethodName: ' + purchaseOrderHeaderData.ShipMethodName + '</div>' +
        '<div class="col-xs-4">Status: ' + purchaseOrderHeaderData.Status + '</div>' +
        '</div><div class="row">' +
        '<div class="col-xs-4">OrderDate: ' + purchaseOrderHeaderData.OrderDate + '</div>' +
        '<div class="col-xs-4">ShipDate: ' + purchaseOrderHeaderData.ShipDate + '</div>' +
        '<div class="col-xs-4">SubTotal: ' + purchaseOrderHeaderData.SubTotal + '</div>' +
        '</div><div class="row">' +
        '<div class="col-xs-4">TaxAmt: ' + purchaseOrderHeaderData.TaxAmt + '</div>' +
        '<div class="col-xs-4">Freight: ' + purchaseOrderHeaderData.Freight + '</div>' +
        '<div class="col-xs-4">TotalDue: ' + purchaseOrderHeaderData.TotalDue + '</div>' +
        '</div></div><br><br>';

    var purchaseOrderDetailsData = data.PurchaseOrderDetails.value;
    chart_data = google.visualization.arrayToDataTable(purchaseOrderDetailsData);
    chart_title = 'PurchaseOrderDetails';

    bot_message += '<div class="container" id="msg' + bot_message_id + '"></div></li>';

    $('.chat').append(bot_message).ready(function () {
        $("html, body").animate({
            scrollTop: $('.chat').height()
        }, 1);
    });
    drawTable();
}

function drawTextMessage(data) {
    var bot_message = '<li class="other"><div class="msg" id="msg' + bot_message_id + '">' + data + '</div></li>';
    // append the bot message to the ol
    $('.chat').append(bot_message).ready(function () {
        $("html, body").animate({
            scrollTop: $('.chat').height()
        }, 1);
    });
}

function draw_charts(data) {
    $("#waiting").remove();
    $(data.response).each(function () {
        bot_message_id = bot_message_id + 1;
        if (this.chart === 'text') {
            drawTextMessage(this.data);
        } else if (this.chart === 'customHeadingTables') {
            for (var i = 0; i < this.data.length; ++i) {
                drawCustomHeadingTables(this.data[i]);
                bot_message_id++;
            }
        } else {
            chart_data = google.visualization.arrayToDataTable(this.data);
            chart_title = this.chart_title;
            bot_message = '<li class="other"><div class="msg" id="msg' + bot_message_id + '"></div></li>';
            // append the bot message to the ol
            $('.chat').append(bot_message).ready(function () {
                $("html, body").animate({
                    scrollTop: $('.chat').height()
                }, 1);
            });

            if (this.chart === 'pie') {
                drawPieChart();
            } else if (this.chart === 'bar') {
                drawBarChart();
            } else if (this.chart === 'table') {
                drawTable();
            } else if (this.chart === 'line') {
                drawLineChart();
            } else if (this.chart === 'donut') {
                drawDonutChart();
            }
        }
    });
}

function get_message_result(message, callback) {
    "use strict";
    $.ajax({
        type: 'GET',
        url: "/api/resolve_query",
        data: {
            message: message
        },
        contentType: 'application/json;charset=UTF-8',
        headers: {
            "x-access-token": sessionStorage.getItem('accessToken')
        },
        success: function (response) {
            callback(response);
        },
        error: function (error) {
            $("#waiting").remove();
            var bot_message = '<li class="other"><div class="msg"><p>' + error.responseJSON.message + '</p></div></li>';
            // append the bot message to the ol
            $('.chat').append(bot_message).ready(function () {
                $("html, body").animate({
                    scrollTop: $('.chat').height()
                }, 1);
            });
        }
    });
}


function print_initial_queries(queries) {
    if (queries.length < 1) {
        $("#init_loader").remove();
        return;
    }
    for (var query of queries) {
        //query = query.user_query;
        prev_message = query.user_query;
        var user_message = '<li class="self"><div class="msg">' +
            prev_message.replace('<', ' less than ').replace('>', ' greater than ').replace('=', ' equal to ') + '</div></li>';
        $('.chat').append(user_message);
        draw_charts(query.query_response);
    }
    $("#init_loader").remove();
}

function get_initial_queries() {

    $.ajax({
        type: "GET",
        url: "/api/get_popular_queries",
        data: {
            queries: 5
        },
        contentType: 'application/json;charset=UTF-8',
        headers: {
            "x-access-token": sessionStorage.getItem('accessToken')
        },

        success: function (response) {
            console.log(response);
            print_initial_queries(response);
        },
        error: function (error) {
            console.log('Error ');
            console.log(error);
            var bot_message = '<li class="other"><div class="msg"><p>Error: Could not Load Previous Queries...</p></div></li>';
            // append the bot message to the ol
            $('.chat').append(bot_message);
            $("#init_loader").remove();
        }
    });
}

function submit_message(message) {
    "use strict";
    prev_message = message;
    // Replace <, >, =
    message = message.replace('<', ' less than ').replace('>', ' greater than ').replace('=', ' equal to ');

    // Append self message as li
    var user_message = '<li class="self"><div class="msg">' + message + '</div></li>';
    $('#chatList').append(user_message);

    // loading Animation
    var loading = '<li class="other" id="waiting"><div class="msg"><h5 class="loading">Getting Results</h5></div></li>';
    $('#chatList').append(loading).ready(function () {
        $("html, body").animate({
            scrollTop: $('.chat').height()
        }, 1);
    });

    // clear the text input
    $('#input_message').val('');

    // post message to python server and get result
    get_message_result(message, draw_charts);
}


$(document).ready(function () {
    // Load google charts
    google.charts.load('current', {
        callback: get_initial_queries,
        language: 'en_IN',
        packages: ['bar', 'corechart', 'table']
    });
});

// on up key fill previous value
$('#target').keydown(function (e) {
    if (e.keyCode == 38) {
        var input = $('#input_message');
        input.val(prev_message);
        input.focus().val(input.val());
    }
});

$('#target').on('submit', function (e) {
    e.preventDefault();
    var input_message = $('#input_message').val();
    // return if the user does not enter any text
    if (!input_message) {
        return;
    }
    // send the message
    submit_message(input_message);
});
