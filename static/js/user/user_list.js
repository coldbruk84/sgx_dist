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

$(document).ready(function() {
    console.log("시작");

    // 모달 닫힐 때 모달 초기화
    $('.modal').on('hidden.bs.modal', function (e) {
        console.log('modal close');
        initModal();
        //$(this).find('form')[0].reset();
    });

    // 삭제 버튼
    $("#userDelete").click(function () {
        deleteUser();
    });

    // 팝업 창의 삭제 버튼
    $(".btn-li-delete").click(function () {
        var name = $(this).attr("value");
        console.log(name);
        deleteUser_single(name);
        // var td0 = $(this).closest("tr").find("td").eq(0).children();
        // var td1 = $(this).closest("tr").find("td").eq(1).html();
        // console.log(td1);
        //
        // td0.attr("checked",true);
        // console.log(td0.is(":checked"));
        //
        // deleteUser2(td1);
    });

    // 팝업 창의 수정 버튼
    $(".btn-edit").click(function () {
        var name = $(this).attr("value");
        console.log(name);
        usernameField.val(name);
        usernameField.attr("readonly",true);
        $("#userSubmit").text("수정");
    });

    // 팝업 창의 새로고침 버튼
    $(".btn-refresh").click(function () {
        location.reload();
    });

    // submit 이벤트 작동 시
    userSubmit.click(function () {
        let btnAction = userSubmit.text();
        if (btnAction === "등록") {
            if(register_valid() === false) {
                return;
            }
        }
        else if (btnAction === "수정") {
            if(edit_valid() === false) {
                return;
            }

        }

    });

});

function register_valid() {

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

function edit_valid() {
    // password 필드에 텍스트가 없으면
    if(passwordField.val() === "" | passwordField.val() == null){
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
                $("#modal-form").modal('hide');
                location.reload();
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
    console.log("initModal");
    usernameGroup.removeClass("has-error");
    passwordGroup.removeClass("has-error");
    emailGroup.removeClass("has-error");

    usernameSpan.text("");
    passwordSpan.text("");
    emailSpan.text("");

    usernameField.val("");
    usernameField.attr("readonly",false);
    passwordField.val("");
    emailField.val("");

    userSubmit.text("등록");
}

function deleteUser_single(name){
    const selected = [];
    selected.push(name);

    swal({
        title: "선택한 사용자를 삭제하겠습니까?",
        text: "선택한 사용자가 삭제됩니다.",
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
                            // $('div.table-responsive tr').each(function() {
                            //     if ($(this).find("td").eq(1).html() === name) {
                            //         $(this).remove();
                            //     }
                            // });
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

function deleteUser(){
    const selected = [];

    // $('div.table-responsive input[type=checkbox]').each(function() {
    //     if ($(this).is(":checked")) {
    //         selected.push($(this).attr('value'));
    //     }
    // });

    $('#user-table input[type=checkbox]').each(function() {
        if ($(this).is(":checked")) {
            selected.push($(this).attr('value'));
        }
    });

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
                            // $('div.table-responsive input[type=checkbox]').each(function() {
                            //     if ($(this).is(":checked")) {
                            //         $(this).closest("tr").remove();
                            //         location.reload(true);
                            //     }
                            // });
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

