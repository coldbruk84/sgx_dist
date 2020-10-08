$(document).ready(function(){
    // LEFT CSS 설정
    let nowLocation = window.location.href.split('/');

    $("#side-menu").children('li').attr('class','')
    $("#side-menu").children('li:first').attr('class','nav-header')

    if (nowLocation[3] == '') {
        $("#home").attr('class','active')
    } else if (nowLocation[3] == 'dockers'){
        $("#dockers").attr('class','active')
    } else if (nowLocation[3] == 'lkl'){
        $("#lkl").attr('class','active')
        if(nowLocation[4] == 'create'){
            $("#lkl").children('ul').children('li:eq(0)').children('a').attr('style','color:white')
        }else if(nowLocation[4] == 'execution' || nowLocation[4] == 'executionDetail'){
            $("#lkl").children('ul').children('li:eq(1)').children('a').attr('style','color:white')
        }
        $("#lkl").children('ul').attr('class','nav nav-second-level collapse in')
    } else if (nowLocation[3] == 'user'){
        $("#user").attr('class','active')
    }
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});