$('.btn').on('click', function(){
    var bdata = $(this).attr('data-button');
    if (bdata != 'None'){
        window.location.replace('/?page='+$(this).attr('data-button'));
    }
});

$(".myBtn").on('click', function(){
    var bdata = $.parseJSON($(this).attr('data-button'));
    $('.modal_header').text('Residents of ' + bdata['planet']);

    $.ajax({
        type: 'GET',
        url: "http://swapi.co/api/planets/?page=" + bdata['page'],
        data: { get_param: 'value' },
        dataType: 'json',
        success: function (data) { 
            var residents = data['results'][bdata['p_index']]['residents'];
            var content = "<table class='table table-hover'><thead>"
            content += "<tr><th>Name</th><th>height (in meters)</th><th>mass (in kg)</th>"
            content += "<th>skin color</th><th>hair color</th><th>eye color</th>"
            content += "<th>birth year</th><th>gender</tr></thead><tbody>";
            for(i=0; i < residents.length; i++){
                content +="<tr>";
                $.ajax({
                    type: 'GET',
                    url: residents[i],
                    data: { get_param: 'value' },
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        content += "<td>" + data['name'] + "</td>";
                        content += "<td>" + data['height'] + "</td>";
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
            $('#myModal').css("display", "block");
        }    
    });
});

// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/*
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}*/