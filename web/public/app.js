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