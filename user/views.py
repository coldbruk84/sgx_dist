from django.contrib.auth.hashers import make_password, check_password
from django.shortcuts import render, redirect
from .models import SgxUser
from .forms import LoginForm


# Create your views here.
def getlist(request):
    context = {'jsUrl': 'user/user_list.js'}
    return render(request, 'user_list.html', context)


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
