from django.shortcuts import render, redirect
import docker


# Create your views here.
def index(request):
    if request.session.get('user'):
        user = request.session.get('user')
        name = request.session.get('name')
        email = request.session.get('email')

        client = docker.from_env()
        cliInfo = client.info()

        res_data = {'user': user, 'name': name, 'email': email, 'cliInfo': cliInfo, 'jsUrl': 'home/home.js'}

        return render(request, 'home.html', res_data)
    else:
        return redirect('/user/login')