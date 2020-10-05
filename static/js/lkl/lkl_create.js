$(document).ready(function(){
    // 검색 input
    $("#lklKeyword").on("keyup", function() {
        const value = $(this).val().toLowerCase();
        $("#imageList > tbody > tr").hide();
        const temp = $("#imageList > tbody > tr > td:nth-child(5n+2):contains('" + value + "')");
        $(temp).parent().show();
    });

    $('#imageList').find('tr').click( function(){

        $("#repository").val("")

        const id            = $(this).find('td:eq(0)').text();
        const repository    = $(this).find('td:eq(1)').text();
        const tag           = $(this).find('td:eq(2)').text();
        const size          = $(this).find('td:eq(3)').text();
        const category      = $(this).find('td:eq(5)').text();
        const dockerId      = $(this).find('td:eq(6)').text();
        const sourcePath    = $(this).find('td:eq(7)').text();

        $("#category").val(category)
        $("#fullImageName").val(repository)
        $("#dockerName").val(repository)
        $("#size").val( Math.round(parseInt(size)/100000) )
        $("#imageId").val(id)
        $("#dockerId").val(repository+':'+tag)
        $("#sourcePath").val(sourcePath)

        $("#addRepoName").text(repository+'_')
        $('#imageList').find('tr').attr('style','')
        $(this).attr('style','background:#9ad0c5')
    });

    $("#repository").keyup(function (){
        let tmpImageName = $(this).val();
        $("#fullImageName").val($("#addRepoName").text()+tmpImageName);
    });

    /*Form Submit*/
    $("#sgxRegisterBtn").click(function (){
        if(form_validation()){
            let form_result = form_validation()
            return false
        }

        let valid_repository = $('#repository').val();
        let valid_size = $('#size').val();
        if(valid_repository == ''){
            swal({ title: "",text: "SGX 이미지 파일명을 입력해 주세요.",type: "warning"});
        }else if(valid_size == ''){
            swal({ title: "",text: "SGX 이미지 파일크기를 입력해 주세요.",type: "warning"});
        }else{
            swal({
                title: "이미지 파일을 생성하겠습니까?",
                text: "작성한 내용으로 SGX 이미지를 생성합니다. ",
                type: "success",
                showCancelButton: true,
                confirmButtonColor: "#2f5dea",
                confirmButtonText: "YES",
                cancelButtonText: "NO",
                closeOnConfirm: true,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    const queryString = $("form[name=sgxRegisterForm]").serialize();
                    $.ajax({
                        type: "POST",
                        url: "/lkl/createLkl/",
                        data: queryString,
                        async: true,
                        success: function(response){
                            console.log(response)
                            swal({
                                    title:"생성되었습니다.",
                                    text:"SGX 이미지 파일이 생성되었습니다. 실행 페이지로 이동할까요?",
                                    type:"success",
                                    closeOnConfirm: true}
                                ,function (isConfirm){
                                    if(isConfirm){
                                        const form = document.createElement('form');
                                        let objs;
                                        objs = document.createElement('input');
                                        objs.setAttribute('type', 'text');
                                        objs.setAttribute('name', 'category');
                                        objs.setAttribute('value', $('#category').val());
                                        objs.setAttribute('type', 'text');
                                        objs.setAttribute('name', 'imageName');
                                        objs.setAttribute('value', $('#fullImageName').val());
                                        form.appendChild(objs);
                                        form.setAttribute('method', 'post');
                                        form.setAttribute('action', "/lkl/execution"); //보내는 url
                                        document.body.appendChild(form);
                                        form.submit();
                                    }
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

    function form_validation(){
        const queryString = $("form[name=sgxRegisterForm]").serialize();
        let rntVal = {};
        $.ajax({
            type: "POST",
            url: "/lkl/validLkl/",
            data: queryString,
            async: true,
            success: function(response){
                console.log(response)
                return true
            },
            error: function(error){
                console.log(error)
                return false
            },
        });
    }
});
