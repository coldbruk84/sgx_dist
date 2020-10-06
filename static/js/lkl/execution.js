$(document).ready(function(){
    $("input[name*='chkBox']").click(function(){
        $("input[name*='chkBox']").prop("checked", false);
        $(this).prop("checked", true);
        $("table tr").not(this).removeClass('blue-skin text-white');
        $(this).closest("tr").attr("class","blue-skin text-white");
    });


    $("#executionPython").click(function(){
        executionSGXImage();
    });

    $("#executionNodejs").click(function(){
        executionSGXImage();
    });

    $("#executionJava").click(function(){
        executionSGXImage();
    });

    $("#executionC").click(function(){
        executionSGXImage();
    });

    $("#deletePython").click(function(){
        deleteSGXImage();
    });

    $("#deleteNodejs").click(function(){
        deleteSGXImage();
    });

    $("#deleteJava").click(function(){
        deleteSGXImage();
    });

    $("#deleteC").click(function(){
        deleteSGXImage();
    });

    $(".nav-tabs").click(function(){
        $("input[name*='chkBox']").prop("checked", false);
        $("table tr").removeClass('blue-skin text-white');
    });

    function executionSGXImage(){
        const selectedImage = [];
        let selectImageName = "";
        $('div.table-responsive input[type=checkbox]').each(function() {
           if ($(this).is(":checked")) {
               const tds = $(this).closest("tr").children();
               selectImageName = tds.eq(2).text();
               selectedImage.push($(this).attr('value'));
           }
        });

        if(selectedImage.length == 0){
            swal({
                title: "",
                text: "실행할 SGX 이미지를 선택해 주세요",
                type: "warning"
            });
            return false;
        }

        const exeForm = document.createElement('form');

        let obj1;
        obj1 = document.createElement('input');
        obj1.setAttribute('type', 'text');
        obj1.setAttribute('name', 'category');
        obj1.setAttribute('value', $('#category').val());
        exeForm.appendChild(obj1);

        let obj2;
        obj2 = document.createElement('input');
        obj2.setAttribute('type', 'text');
        obj2.setAttribute('name', 'imageName');
        obj2.setAttribute('value', selectImageName);
        exeForm.appendChild(obj2);

        let obj3;
        obj3 = document.createElement('input');
        obj3.setAttribute('type', 'hidden');
        obj3.setAttribute('name', 'csrfmiddlewaretoken');
        obj3.setAttribute('value', csrftoken);
        exeForm.appendChild(obj3);

        exeForm.setAttribute('method', 'post');
        exeForm.setAttribute('action', "/lkl/executionDetail/");
        document.body.appendChild(exeForm);
        exeForm.submit();

    }


    function deleteSGXImage(){
        const selected = [];
        $('div.table-responsive input[type=checkbox]').each(function() {
           if ($(this).is(":checked")) {
               selected.push($(this).attr('value'));
           }
        });

        if(selected.length == 0){
            swal({
                title: "",
                text: "삭제할 SGX 이미지를 선택해 주세요",
                type: "warning"
            });
            return false;
        }

        swal({
        title: "선택한 이미지를 삭제하겠습니까?",
        text: "선택한 SGX 이미지 및 설정 파일이 모두 삭제됩니다.",
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
                    url: "/lkl/deleteImage/",
                    data: {'chk': selected},
                    async: false,
                    success: function(response){
                        swal({
                                title:"삭제되었습니다.",
                                text:"도커 이미지 및 경로의 모든 파일이 삭제되었습니다.",
                                type:"success",
                                closeOnConfirm: true}
                        ,function (isConfirm){
                            $('div.table-responsive input[type=checkbox]').each(function() {
                               if ($(this).is(":checked")) {
                                   $(this).closest("tr").remove();
                               }
                            });
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
    }
});