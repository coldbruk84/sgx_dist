from django.shortcuts import render
import docker


# Create your views here.
def getlist(request):
    client = docker.from_env()

    print(client.containers())

    print(client.images())

    print(client.logs)

    return render(request, 'docker_list.html')


def register(request):
    return render(request, 'docker_register.html')