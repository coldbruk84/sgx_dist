const usernameField = $("#userName");
const usernameGroup = $("#userNameGroup");
const usernameSpan = $("#userNameSpan");
const passwordField = $("#password");
const passwordGroup = $("#passwordGroup");
const passwordSpan = $("#passwordSpan");
const emailField = $("#email");
const emailGroup = $("#emailGroup");
const emailSpan = $("#emailSpan");
const usertable = $("#user-table");
const editUser = $("#editUser");
const userSubmit = $("#userSubmit");

const usernameCheck = RegExp(/^[A-Za-z0-9_\-]{4,20}$/); // username 검증 : 영어 대소문자와 숫자, 특문 _ - 사용가능, 4~20자리
const passwordCheck = RegExp(/^[A-Za-z0-9]{4,20}$/); // password 검증 : 영어 대소문자와 숫자 사용가능, 4~20자리
const emailCheck = RegExp(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/); // email 검증 : 올바른 이메일 양식

// $(셀렉터).html() : 셀렉터 하위에 있는 자식 태그들을 태그나 문자열 따질 것 없이 전부 가져온다.
// $(셀렉터).text() : 셀렉터 하위에 있는 자식 태그들의 문자열만 출력
// $(셀렉터).val() : input 태그에 정의된 value 속성의 값을 확인하고자 할 때 사용
// == 와 === 의 차이 : == 는 동치 연산 전에 피연산자들을 형변환 시키고, === 는 형변환 하지 않고 동치 연산을 실행한다.
// == 는 작업자가 원치 않는 강제 형변환을 실행할 수 있으므로, 명시적인 형변환을 통한 === 의 사용을 권장

$(document).ready(function() {
    console.log("시작");

    // 모달 닫힐 때 모달 초기화
    $('.modal').on('hidden.bs.modal', function (e) {
        console.log('modal close');
        initModal();
    });

    // 리스트의 삭제 버튼
    $("#userDelete").click(function () {
        deleteUser();
    });

    // 팝업 창의 삭제 버튼
    $(".btn-li-delete").click(function () {
        let name = $(this).attr("value");
        deleteUser(name);
    });

    // 팝업 창의 수정 버튼
    $(".btn-edit").click(function () {
        let name = $(this).attr("value");
        usernameField.val(name);
        usernameField.attr("readonly",true);
        $("#userSubmit").text("수정");
    });

    // 팝업 창의 새로고침 버튼
    $(".btn-refresh").click(function () {
        location.reload();
    });

    // 모달 창의 submit 이벤트 작동 시
    userSubmit.click(function () {
        let btnAction = userSubmit.text();
        // 사용자 등록일 경우,
        if (btnAction === "등록") {
            if(register_valid() === false) {
                return;
            }
        }
        // 사용자 수정일 경우,
        else if (btnAction === "수정") {
            if(edit_valid() === false) {
                return;
            }
        }
    });

    // 검색 input
    $("#userKeyword").on("keyup", function() {
        const value = $(this).val();
        $("#user-table > tbody > tr").hide();
        const temp = $("#user-table > tbody > tr > td:nth-child(2):contains('" + value + "')");
        $(temp).parent().show();
    });

});

// 폼의 유효성 검증 실패 시 해당 폼의 영역에 에러 메시지를 출력
function make_error(target,msg) {
    if(target == "username") {
        usernameGroup.addClass("has-error");
        usernameSpan.text(msg);
        usernameField.focus();
    }
    else if(target == "password") {
        passwordGroup.addClass("has-error");
        passwordSpan.text(msg);
        passwordField.focus();
    }
    else if(target == "email") {
        emailGroup.addClass("has-error");
        emailSpan.text(msg);
        emailField.focus();
    }

}

// 폼의 영역에 표시된 모든 에러 메시지를 초기화
function clean_error() {
    usernameGroup.removeClass("has-error");
    usernameSpan.text("");
    passwordGroup.removeClass("has-error");
    passwordSpan.text("");
    emailGroup.removeClass("has-error");
    emailSpan.text("");

}

// 폼의 유효성을 검증하고, 에러메시지를 출력하는 함수 호출
function error_check(form) {
    if(form == "register") {
        // userName 필드에 텍스트가 없으면
        if(usernameField.val() === "" | usernameField.val() == null) {
            make_error("username","사용자명을 입력해 주세요.");
            return false;
        }
        // userName 이 중복이면
        else if(userNameIsDuplicated()) {
            make_error("username","동일한 사용자가 있습니다.");
            return false;
        }
        // username 정규식 : 영어 대소문자와 숫자, 특문 _ - 사용 가능, 4~20자리
        else if(usernameCheck.test(usernameField.val()) == false) {
            make_error("username","영어 대소문자와 숫자, 특수문자(_,-)만 입력가능하며, 4~20자리로 입력해 주세요.");
            return false;
        }
        // password 필드에 텍스트가 없으면
        else if(passwordField.val() === "" | passwordField.val() == null){
            clean_error();
            make_error("password","비밀번호를 입력해 주세요.");
            return false;
        }
        // password 정규식 : 영어 대소문자와 숫자만 사용 가능, 4~20자리
        else if(passwordCheck.test(passwordField.val()) == false) {
            clean_error();
            make_error("password","영어 대소문자와 숫자만 입력가능하며, 4~20자리로 입력해 주세요.");
            return false;
        }
        // email 필드에 텍스트가 없으면
        else if(emailField.val() === "" | emailField.val() === null){
            clean_error();
            make_error("email","이메일을 입력해 주세요.");
            return false;
        }
        // email 정규식 : 올바른 이메일 양식
        else if(emailCheck.test(emailField.val()) == false) {
            clean_error();
            make_error("email","올바른 이메일 양식을 입력해 주세요. ex) admin@gmail.com ");
            return false;
        }
        else {
            clean_error();
            console.log("register 검증 통과");
            return true;
        }
    }
    else if(form == "edit") {
        // password 필드에 텍스트가 없으면
        if(passwordField.val() === "" | passwordField.val() == null){
            make_error("password","비밀번호를 입력해 주세요.");
            return false;
        }
        // password 정규식 : 영어 대소문자와 숫자만 사용 가능, 4~20자리
        else if(passwordCheck.test(passwordField.val()) == false) {
            make_error("password","영어 대소문자와 숫자만 입력가능하며, 4~20자리로 입력해 주세요.");
            return false;
        }
        // email 필드에 텍스트가 없으면
        else if(emailField.val() === "" | emailField.val() === null){
            clean_error();
            make_error("email","이메일을 입력해 주세요.");
            return false;
        }
        // email 정규식
        else if(emailCheck.test(emailField.val()) == false) {
            clean_error();
            make_error("email","올바른 이메일 양식을 입력해 주세요. ex) admin@gmail.com ");
            return false;
        }
        // 모든 유효성 검사를 통과
        else {
            clean_error();
            console.log("edit 검증 통과");
            return true;
        }
    }

}

// 모달 폼이 닫힐 때 폼 초기화
function initModal() {
    console.log("initModal");
    clean_error();

    usernameField.val("");
    usernameField.attr("readonly",false);
    passwordField.val("");
    emailField.val("");

    userSubmit.text("등록");
}

// 사용자 등록 시 각 폼의 유효성을 검증하고, 검증이 완료되면 submit 을 처리
function register_valid() {
    // 폼의 유효성 검사, 에러 발생시 return false;
    if (error_check("register") == false) {
        return false;
    }

    //등록 확인 메세지
    swal({
        title: "사용자를 등록하겠습니까?",
        text: "작성한 내용으로 사용자를 등록합니다. ",
        type: "success",
        showCancelButton: true,
        confirmButtonColor: "#2f5dea",
        confirmButtonText: "YES",
        cancelButtonText: "NO",
        closeOnConfirm: false,
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

// 사용자 수정 시 폼의 유효성 검증 및 submit 처리
function edit_valid() {
    // 폼의 유효성 검사, 에러 발생시 return false;
    if (error_check("edit") == false){
        return false;
    }

    // 수정 확인 메시지
    swal({
        title: "사용자를 수정하겠습니까?",
        text: "작성한 내용으로 사용자를 수정합니다. ",
        type: "success",
        showCancelButton: true,
        confirmButtonColor: "#2f5dea",
        confirmButtonText: "YES",
        cancelButtonText: "NO",
        closeOnConfirm: false, // Set to false if you want the modal to stay open even if the user presses the "Confirm"-button.
        // This is especially useful if the function attached to the "Confirm"-button is another SweetAlert.
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            const queryString = $("form[name=userModalForm]").serialize();
            $.ajax({
                type: "POST",
                url: "/user/editUser/",
                data: queryString,
                async: true,
                success: function(response){
                    console.log(response);
                    swal({
                        title: "성공",
                        text: "수정이 완료 되었습니다.",
                        type: "success",
                        confirmButtonColor: "#2f5dea",
                        confirmButtonText: "YES",
                        closeOnConfirm: true,
                    }, function (isConfirm) {
                        if(isConfirm) {
                            $("#modal-form").modal('hide');
                            location.reload();
                        }
                    });
                },
                // ajax 오류 발생 시
                error: function(error){
                    console.log(error);
                    swal("에러", "수정 중 예기치 못한 오류가 발생하였습니다.", "error");
                    $("#modal-form").modal('hide');
                }
            });
        } else {
            swal("취소", "취소되었습니다.", "error");
            return false;
        }
    });

}

// 사용자 등록 시, 신규 사용자 이름 중복 검사
function userNameIsDuplicated() {
    const queryString = $("form[name=userModalForm]").serialize();
    let result;
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

// 사용자 삭제, 단일 사용자 삭제와 다중 사용자 삭제 구분
function deleteUser(name){
    const selected = [];
    // 팝업 창의 단일 유저 삭제일 경우,
    if(name) {
        console.log("단일 삭제");
        selected.push(name);
    }
    // 리스트의 체크박스 체크를 통한 다중 유저 삭제일 경우,
    else {
        console.log("다중 삭제");
        $('#user-table input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                selected.push($(this).attr('value'));
            }
        });
        console.log(selected);
    }

    // 선택된 유저가 없을 경우,
    if(selected.length == 0){
        swal({
            title: "",
            text: "삭제할 사용자를 선택해 주세요",
            type: "warning"
        });
        return false;
    }

    swal({
        title: "선택한 사용자를 삭제하겠습니까?",
        text: "선택한 사용자가 모두 삭제됩니다.",
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
                url: "/user/deleteUser/",
                data: {'chk': selected},
                async: true,
                success: function(response){
                    swal({
                            title:"삭제되었습니다.",
                            text:"선택한 사용자가 삭제되었습니다.",
                            type:"success",
                            closeOnConfirm: true }
                        ,function (isConfirm){
                            location.reload();
                        });
                },
                error: function(error){
                    swal("에러", "삭제 중 오류가 발생하였습니다.", "error");
                },
            });
        } else {
            swal("취소", "취소되었습니다.", "error");
            return false;
        }
    });
}


