from django.contrib.auth.hashers import make_password, check_password
from django.shortcuts import render, redirect
from .models import SgxUser


# Create your views here.
def getlist(request):
    return render(request, 'user_list.html')


def register(request):
    if request.method == 'GET':
        return render(request, 'user_register.html')
    elif request.method == "POST":
        username = request.POST.get('username', None)
        useremail = request.POST.get('useremail', None)
        password = request.POST.get('password', None)
        re_password = request.POST.get('re_password', None)

        res_date = {}

        if not (username and useremail and password and re_password):
            res_date['error'] = '모든 값을 입력해야 합니다.'

        if password != re_password:
            res_date['error'] = '비밀번호가 다릅니다.'

        sgxUser = SgxUser(
            username=username,
            useremail=useremail,
            password=make_password(password)
        )

        sgxUser.save()

        return render(request, 'user_register.html', res_date)


def login(request):
    if request.method == 'GET':
        return render(request, 'login.html')
    elif request.method == 'POST':
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)

        res_data = {}
        if not (username and password):
            res_data['error'] = '모든 값을 입력해야 합니다.'
        else:
            sgxUser = SgxUser.objects.get(username=username)
            if check_password(password, sgxUser.password):
                # 세션 저장
                request.session['user'] = sgxUser.id
                request.session['name'] = sgxUser.username
                request.session['email'] = sgxUser.useremail
                # 로그인처리
                return redirect('/')
            else:
                res_data['error'] = '비밀번호가 다릅니다.'

        return render(request, 'login.html', res_data)


def logout(request):
    if request.session.get('user'):
        del (request.session['user'])
        del (request.session['name'])
        del (request.session['email'])

    return redirect('/')
