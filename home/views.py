from django.shortcuts import render, redirect
import dockers


# Create your views here.
def index(request):
    print(request.session.get('user'))
    if request.session.get('user'):
        user = request.session.get('user')
        name = request.session.get('name')
        email = request.session.get('email')

        res_data = {'name': name, 'email': email}

        return render(request, 'home.html', res_data)
    else:
        return redirect('/user/login')


def show_state():
    client = dockers.from_env()

    container = client.containers.get(client.containers.list(0))
    for line in container.logs(stream=True):
        print(line.strip())

    return True
