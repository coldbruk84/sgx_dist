$("#delete").click(function(){
    const selected = [];
    $('div.table-responsive input[type=checkbox]').each(function() {
       if ($(this).is(":checked")) {
           selected.push($(this).attr('value'));
       }
    });

    if(selected.length == 0){
        swal({
            title: "",
            text: "삭제할 Docker 이미지를 선택해 주세요",
            type: "warning"
        });
        return false;
    }


    swal({
        title: "선택한 이미지를 삭제하시겠습니까?",
        text: "선택한 도커 이미지 및 생성된 경로의 모든 파일이 삭제됩니다.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "YES",
        cancelButtonText: "NO",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            $.ajax({
                type: "POST",
                url: "/dockers/delete/",
                data: {'chk': selected},
                async: false,
                success: function(response){
                    swal({
                            title:"삭제되었습니다.",
                            text:"도커 이미지 및 경로의 모든 파일이 삭제되었습니다.",
                            type:"success",
                            closeOnConfirm: true}
                    ,function (isConfirm){
                        $(location).attr("href", "/dockers/list/");
                    });

                },
                error: function(error){
                    swal("에러", "삭제 중 오류가 발생하였습니다.", "error");
                },
            });
        } else {
            swal("취소", "취소되었습니다.", "error");
        }
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