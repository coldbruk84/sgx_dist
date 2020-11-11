$(document).ready(function() {
    $("#userSubmit").submit(function () {
        return modal_validation();
})

    function modal_validation() {

        const usernameField = $("#userName");
        const usernameGroup = $("#userNameGroup");
        const usernameSpan = $("#userNameSpan");
        const passwordField = $("#password");
        const passwordGroup = $("#passwordGroup");
        const passwordSpan = $("#passwordSpan");
        const emailField = $("#email");
        const emailGroup = $("#emailGroup");
        const emailSpan = $("#emailSpan");

        // $(셀렉터).html() : 셀렉터 하위에 있는 자식 태그들을 태그나 문자열 따질 것 없이 전부 가져온다.
        // $(셀렉터).text() : 셀렉터 하위에 있는 자식 태그들의 문자열만 출력
        // $(셀렉터).val() : input 태그에 정의된 value 속성의 값을 확인하고자 할 때 사용
        // == 와 === 의 차이 : == 는 동치 연산 전에 피연산자들을 형변환 시키고, === 는 형변환 하지 않고 동치 연산을 실행한다.
        // == 는 작업자가 원치 않는 강제 형변환을 실행할 수 있으므로, 명시적인 형변환을 통한 === 의 사용을 권장


        // userName 필드에 텍스트가 없으면
        if(usernameField.val() === "" | usernameField.val() == null) {
            usernameGroup.addClass("has-error");
            usernameSpan.text("사용자명을 입력해 주세요.");
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
        // userName 필드에 텍스트가 있으면 DB에 접근해 사용자명 중복을 검사
        else {
            if(userName_validation()){
                //검증 성공하면 성공 클래스 추가
                usernameGroup.addClass("has-success");

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
                                swal("성공", "등록이 완료 되었습니다.", "success");
                            },
                            error: function(error){
                                swal("에러", "삭제 중 오류가 발생하였습니다.", "error");
                                return false;
                            },
                        });
                    } else {
                        swal("취소", "취소되었습니다.", "error");
                        return false;
                    }
                });
            }
            else {
                //검증 실패하면 에러 클래스와 에러 메세지 추가
                usernameGroup.addClass("has-error");
                usernameSpan.text("동일한 사용자가 있습니다.");
                usernameField.focus();
                return false;
            }
        }

    }

    function userName_validation() {
        const queryString = $("form[name=userModalForm]").serialize();
        let rntVal = {};
        $.ajax({
            type: "POST",
            url: "/user/validUser/",
            data: queryString,
            async: true,
            success: function (response) {
                console.log(response)
                return true
            },
            error: function (error) {
                console.log(error)
                return false
            },
        });
    }
}