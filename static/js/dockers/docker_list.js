$("#delete").click(function(){
    const selected = [];
    $('div.table-responsive input[type=checkbox]').each(function() {
       if ($(this).is(":checked")) {
           selected.push($(this).attr('value'));
       }
    });

    if(selected.length == 0){
        alert("삭제할 Docker 이미지를 선택해 주세요");
        return false;
    }

    $.ajax({
        type: "POST",
        url: "/dockers/delete/",
        data: {'chk': selected},
        async: false,
        success: function(response){
            alert('삭제되었습니다.')
            $(location).attr("href", "/dockers/list/");
        },
        error: function(error){
            alert(error)
        },
    });
})

// 검색 input
$("#dockerKeyword").on("keyup", function() {
    const value = $(this).val().toLowerCase();
    $("#dockerTable > tbody > tr").hide();
    const temp = $("#dockerTable > tbody > tr > td:nth-child(8n+3):contains('" + value + "')");
    $(temp).parent().show();
});

// 검색 버튼
$("#searchBtn").click(function(){
    $(location).attr("href", "/dockers/list/");
});