const usernameField = $("#userName");
const usernameGroup = $("#userNameGroup");
const usernameSpan = $("#userNameSpan");
const passwordField = $("#password");
const passwordGroup = $("#passwordGroup");
const passwordSpan = $("#passwordSpan");
const emailField = $("#email");
const emailGroup = $("#emailGroup");
const emailSpan = $("#emailSpan");


$(document).ready(function() {
    console.log("시작");

    // 모달 닫힐 때 모달 초기화
    $('.modal').on('hidden.bs.modal', function (e) {
        console.log('modal close');
        initModal();
        $(this).find('form')[0].reset();
    });

    // submit 이벤트 작동 시
    $("#userSubmit").click(function () {
        if(modal_validation() === false) {
            return;
        }
    });

});

function modal_validation() {

    // $(셀렉터).html() : 셀렉터 하위에 있는 자식 태그들을 태그나 문자열 따질 것 없이 전부 가져온다.
    // $(셀렉터).text() : 셀렉터 하위에 있는 자식 태그들의 문자열만 출력
    // $(셀렉터).val() : input 태그에 정의된 value 속성의 값을 확인하고자 할 때 사용
    // == 와 === 의 차이 : == 는 동치 연산 전에 피연산자들을 형변환 시키고, === 는 형변환 하지 않고 동치 연산을 실행한다.
    // == 는 작업자가 원치 않는 강제 형변환을 실행할 수 있으므로, 명시적인 형변환을 통한 === 의 사용을 권장

    // submit 시 이전에 추가 했던 has-error 제거, span 초기화
    initModal();

    // userName 필드에 텍스트가 없으면
    if(usernameField.val() === "" | usernameField.val() == null) {
        usernameGroup.addClass("has-error");
        usernameSpan.text("사용자명을 입력해 주세요.");
        usernameField.focus();
        return false;
    }
    // userName 이 중복이면
    else if(userNameIsDuplicated()) {
        usernameGroup.addClass("has-error");
        usernameSpan.text("동일한 사용자가 있습니다.");
        usernameField.focus();
        return false;
    }
    // password 필드에 텍스트가 없으면
    else if(passwordField.val() === "" | passwordField.val() == null){
        passwordGroup.addClass("has-error");
        passwordSpan.text("비밀번호를 입력해 주세요.");
        passwordField.focus();
        return false;
    }
    // email 필드에 텍스트가 없으면
    else if(emailField.val() === "" | emailField.val() === null){
        emailGroup.addClass(("has-error"));
        emailSpan.text("이메일을 입력해 주세요.");
        emailField.focus();
        return false;
    }
    // 모든 유효성 검사를 통과
    else {
        console.log("검증 통과");
        //등록 확인 메세지
        swal({
            title: "사용자를 등록하겠습니까?",
            text: "작성한 내용으로 사용자를 등록합니다. ",
            type: "success",
            showCancelButton: true,
            confirmButtonColor: "#2f5dea",
            confirmButtonText: "YES",
            cancelButtonText: "NO",
            closeOnConfirm: true,
            closeOnCancel: false
        }, function (isConfirm) {
            if (isConfirm) {
                const queryString = $("form[name=userModalForm]").serialize();
                $.ajax({
                    type: "POST",
                    url: "/user/list/",
                    data: queryString,
                    async: true,
                    success: function(response){
                        console.log(response)
                        // 등록 성공 시
                        if (response === "O") {
                            swal({
                                title: "성공",
                                text: "등록이 완료 되었습니다.",
                                type: "success",
                                showCancelButton: true,
                                confirmButtonColor: "#2f5dea",
                                confirmButtonText: "YES",
                                closeOnConfirm: true,
                            }, function (isConfirm) {
                                if (isConfirm) {
                                    //확인 버튼을 누르면 모달 창을 닫고, 페이지 새로고침
                                    $("#modal-form").modal('hide');
                                    location.reload();
                                }
                            });
                        }
                        // 등록 실패 시
                        else {
                            console.log(response)
                            swal("에러", "등록에 실패하였습니다.", "error");
                            $("#modal-form").modal('hide');
                        }
                    },
                    // ajax 오류 발생 시
                    error: function(error){
                        console.log(error)
                        swal("에러", "등록 중 예기치 못한 오류가 발생하였습니다.", "error");
                        $("#modal-form").modal('hide');
                    }

                });
                // 등록 취소 시
            } else {
                swal("취소", "취소되었습니다.", "error");
                return false;
            }
        });

    }
}

//사용자 이름 중복 검사
function userNameIsDuplicated() {
    const queryString = $("form[name=userModalForm]").serialize();
    var result;
    $.ajax({
        type: "POST",
        url: "/user/validUser/",
        data: queryString,
        async: false,
        success: function (response) {
            // 중복된 이름이 있으면
            if(response === "O") {
                console.log("사용자 이름 중복 : " + response)
                result = true;
            }
            else {
                console.log("사용자 이름 중복 : " + response)
                result = false;
            }
        },
        error: function (error) {
            console.log("error : "+error);
            alert("사용자 이름 중복 검사에 오류 발생")
        }
    });
    console.log("result : "+result);
    return result;

}

function initModal() {
    usernameGroup.removeClass("has-error");
    passwordGroup.removeClass("has-error");
    emailGroup.removeClass("has-error");
    usernameSpan.text("");
    passwordSpan.text("");
    emailSpan.text("");
}