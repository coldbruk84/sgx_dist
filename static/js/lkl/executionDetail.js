$(document).ready(function(){

    $("#sgxCancelBtn").click(function (){
        location.href="/lkl/execution/"
    });

    /*Form Submit*/
    $("#sgxExecuteBtn").click(function (){
        if(create_cfg()){
            return false
        }



        let SGX_ETHREADS = $('#SGX_ETHREADS').val();
        let SGX_STACK_SIZE = $('#SGX_STACK_SIZE').val();
        if(SGX_ETHREADS == ''){
            swal({ title: "",text: "스레드 수를 입력해 주세요.",type: "warning"});
        }else if(SGX_STACK_SIZE == ''){
            swal({ title: "",text: "Stack Size를 입력해 주세요.",type: "warning"});
        }else{
            swal({
                title: "Enclave 환경에서 이미지를 실행하시겠습니까?",
                text: "생성된 SGX 이미지를 Enclave 환경에서 실행시킵니다.",
                type: "success",
                showCancelButton: true,
                confirmButtonColor: "#2f5dea",
                confirmButtonText: "YES",
                cancelButtonText: "NO",
                closeOnConfirm: true,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    const queryString = $("form[name=sgxExecuteForm]").serialize();
                    $.ajax({
                        type: "POST",
                        url: "/lkl/executionLkl/",
                        data: queryString,
                        async: true,
                        success: function(response){
                            swal({
                                    title:"실행되었습니다.",
                                    text:"SGX 이미지가 실행되었습니다.",
                                    type:"success",
                                    closeOnConfirm: true}
                                ,function (isConfirm){
                                    if(isConfirm){
                                        location.href="/lkl/execution/"
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


    function create_cfg(){
        const queryString = $("form[name=sgxExecuteForm]").serialize();
        let rntVal = {};
        $.ajax({
            type: "POST",
            url: "/lkl/createCfg/",
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