from django.contrib.auth.hashers import make_password, check_password
from django.shortcuts import render, redirect
from .models import SgxUser
from .forms import LoginForm
from django.http import HttpResponse


# Create your views here.
def getlist(request):
    if request.method == "POST":
        username = request.POST['userName']
        useremail = request.POST['email']
        password = request.POST['password']
        resp = ""
        sgxUser = SgxUser(
            username=username,
            useremail=useremail,
            password=make_password(password)
        )
        sgxUser.save()
        try:
            # 위에서 생성한 sgxUser 객체를 획득할 수 있는지 검사
            SgxUser.objects.get(username=username)
            resp = "O"
        except SgxUser.DoesNotExist:
            resp = "X"
        return HttpResponse(resp)

    elif request.method == "GET":
        user = request.session.get('user')
        name = request.session.get('name')
        email = request.session.get('email')
        sessionDic = {'user': user, 'name': name, 'email': email}

        userList = SgxUser.objects.filter()

        context = {'userList': userList, 'jsUrl': 'user/user_list.js'}
        context.update(sessionDic)
        return render(request, 'user_list.html', context)


def validUser(request):
    if request.method == 'POST':
        userName = request.POST['userName']
        # POST로 전달받은 userName으로 sgxUser 객체 획득
        try:
            sgxUserData = SgxUser.objects.get(username=userName)
            # sgxUser 객체 획득 성공 시 userName 중복
            respMsg = "O"
        except SgxUser.DoesNotExist:
            # sgxUser 객체 획득 실패 시 userName 중복 X
            respMsg = "X"
        return HttpResponse(respMsg)


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
    if request.method == 'POST':
        form = LoginForm(request.POST)

        if form.is_valid():
            request.session['user'] = form.user_id
            request.session['name'] = form.user_name
            request.session['email'] = form.user_email

            return redirect('/')
    else:
        form = LoginForm()

    return render(request, 'login.html', {'form': form})


def logout(request):
    if request.session.get('user'):
        del (request.session['user'])
        del (request.session['name'])
        del (request.session['email'])

    return redirect('/user/login')
