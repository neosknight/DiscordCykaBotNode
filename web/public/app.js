function playsound(name){
    $.ajax({
        type:'POST',
        url:'playsounds/' + name,
        success:function(data){
           console.log("Success");

        },
        failure:function(data){
            console.error("Error");
        }
    });
}

function pause(){
    $.ajax({
        type:'POST',
        url:'youtube/play/0',
        success:function(data){
           console.log("Success");

        },
        failure:function(data){
            console.error("Error");
        }
    });
}

function play(){
    $.ajax({
        type:'POST',
        url:'youtube/play/1',
        success:function(data){
           console.log("Success");

        },
        failure:function(data){
            console.error("Error");
        }
    });
}

$(document).on('input change', '#volume_control_slider', function() {
    $('#slider_value').text( $(this).val() );
});

function changeVolume(val){
    var volume = $('#volume_control_slider').val() / 100;

    $.ajax({
        type:'POST',
        url:'youtube/volume/' + volume,
        success:function(data){
            $('#current_value').text( volume * 100 );
        },
        failure:function(data){
            console.error("Error");
        }
    });
}

