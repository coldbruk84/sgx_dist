from django.shortcuts import render
from dockers.models import SgxDocker
from .models import SgxLkl

import docker

# Create your views here.
def createList(request):
    user = request.session.get('user')
    name = request.session.get('name')
    email = request.session.get('email')
    sessionDic = {'user': user, 'name': name, 'email': email}

    client = docker.from_env()
    dockerList = SgxDocker.objects.filter(registered_user_id=user)

    for dockers in dockerList:
        imageFile = client.images.list(name=dockers.repository)[0].attrs
        dockers.__setattr__("size",imageFile.get('Size'))

    context = {'dockerList': dockerList, 'jsUrl': 'lkl/lkl_create.js'}

    context.update(sessionDic)
    return render(request, 'lkl_create.html', context)

def createLkl(request):

    return render(request, 'lkl_create.html')

def execution(request):
    return render(request, 'execution.html')


def execution2(request):
    return render(request, 'execution2.html')

