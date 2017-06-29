$('#reg_button').on('click', function(){
   $('#Signup_Modal').css("display", "block");
});


$('#logout_button').on('click', function(){
   window.location.replace('/logout');
});


$('#login_button').on('click', function(){
   $('#Login_Modal').css("display", "block");
});


$('.btn').on('click', function(){
    var bdata = $(this).attr('data-button');
    if (bdata != 'None'){
        window.location.replace('/?page='+$(this).attr('data-button'));
    }
});


$("#voting_stat_button").on('click', function(){
    $('.modal_header').text('Voting Statistics');
    $.ajax({
        type: 'GET',
        url: "/vote_stats",
        data: { get_param: 'value' },
        dataType: 'json',
        success: function (data) {         
            // table header structure
            var content = "<table class='table table-hover'><thead>";
            content += "<tr><th>Votes</th><th>Planet</th></thead><tbody>";
            for(i=0; i < data.length; i++){
                content +="<tr>";
                content += "<td>" + JSON.stringify(data[i]['count']) + "</td>";
                content += "<td>" + JSON.stringify(data[i]['planet']).replace(/\"/g, "") + "</td>";
                content +="</tr>";
            }    
            content += "</tbody></table>";
            $('.modal_table').empty();
            $('.modal_table').append(content);
            $('#myModal').css("display", "block");
        }
    })
});


$(".myBtn").on('click', function(){
    var bdata = $.parseJSON($(this).attr('data-button'));
    $('.modal_header').text('Residents of ' + bdata['planet']);
    $('#myModal').css("display", "block");
    $('.modal_table').empty();
    $('.modal_table').append("<center>Loading please wait...<br><img src='/static/loading.gif' width='100' height='100'>");
            
    $.ajax({
        type: 'GET',
        url: "http://swapi.co/api/planets/?page=" + bdata['page'],
        data: { get_param: 'value' },
        dataType: 'json',
        success: function (data) {         
            var residents = data['results'][bdata['p_index']]['residents'];
            // table header structure
            var content = "<table class='table table-hover'><thead>"
            content += "<tr><th>Name</th><th>height (in meters)</th><th>mass (in kg)</th>"
            content += "<th>skin color</th><th>hair color</th><th>eye color</th>"
            content += "<th>birth year</th><th>gender</tr></thead><tbody>";
            for(i=0; i < residents.length; i++){
                content +="<tr>";
                // ask residents one by one
                $.ajax({
                    type: 'GET',
                    url: residents[i],
                    data: { get_param: 'value' },
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        content += "<td>" + data['name'] + "</td>";
                        content += "<td>" + (parseInt(data['height'])/100).toFixed(2) + "</td>";
                        content += "<td>" + data['mass'] + "</td>";
                        content += "<td>" + data['skin_color'] + "</td>";
                        content += "<td>" + data['hair_color'] + "</td>";
                        content += "<td>" + data['eye_color'] + "</td>";
                        content += "<td>" + data['birth_year'] + "</td>";
                        content += "<td>" + data['gender'] + "</td>";
                    }
                    });
                content +="</tr>";
            }    
            content += "</tbody></table>";
            $('.modal_table').empty();
            $('.modal_table').append(content);
            
        }    
    });
});


$(".close").on('click', function(){
        $('.modal').css("display", "none");
});


$(".vote_button").on('click', function(){
    var bdata = $(this).attr('data-button');
    $.post("/vote", {"myData": bdata});
    alert('Voted to ' + $.parseJSON(bdata)['Planet']);
    // WHY NOT WORK?
    /*$.ajax({
        url: '/vote', 
        type: 'POST',
        dataType: 'json',
        data: {"myData": bdata}, 
        success: function(response) {
                console.log(response);
            }})*/
});   