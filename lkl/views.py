from django.shortcuts import render, redirect
from dockers.models import SgxDocker
from user.models import SgxUser
from .models import SgxLkl

import docker
import os

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
    if not request.session.get('user'):
        return redirect('/user/login/')

    if request.method == 'POST':
        user_id = request.session.get('user')
        sgxUser = SgxUser.objects.get(pk=user_id)

        sgxDockerData = SgxDocker.objects.get(pk=int(request.POST['imageId']))

        lklData = SgxLkl()
        lklData.imageName = request.POST['repository']
        lklData.imageSize = request.POST['size']
        lklData.imageRun = 'NO'
        lklData.registered_user = request.session.get('user')
        lklData.dockerId = sgxDockerData
        lklData.registeredUser = sgxUser

    makeLKLImages(request)
    lklData.save()

    return redirect('/lkl/create')


def makeLKLImages(request):

    dockerName = request.POST['repository']
    imageSize = request.POST['size']
    imgName = request.POST['repository']

    try:
        os.system("PATH='$PATH:/opt/sgx-lkl/bin'")
        os.system("sgx-lkl-setup")
        os.system("sgx-lkl-disk create --docker="+dockerName+" --size="+imageSize+"M "+imgName+".img")
    except Exception as ex:
        print('에러가 발생 했습니다', ex)

    return True


def execution(request):
    return render(request, 'execution.html')


def execution2(request):
    return render(request, 'execution2.html')

