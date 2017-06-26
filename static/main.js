$('.btn').on('click', function(){
    var bdata = $(this).attr('data-button');
    if (bdata != 'None'){
        window.location.replace('/?page='+$(this).attr('data-button'));
    }

    }
    );