from django.http import HttpResponse
from django.shortcuts import render, redirect
from dockers.models import SgxDocker
from user.models import SgxUser
from .models import SgxLkl

import errno
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
        lklData.imageName = request.POST['fullImageName']
        lklData.imageSize = request.POST['size']
        lklData.imageRun = 'NO'
        lklData.registered_user = request.session.get('user')
        lklData.dockerId = sgxDockerData
        lklData.registeredUser = sgxUser

    imgPath = makeLKLImages(request)

    if imgPath:
        lklData.imagePath = imgPath
        lklData.save()
    else:
        print('에러가 발생 했습니다')

    return HttpResponse("create success %s." % lklData)


def validLkl(request):
    if request.method == 'POST':
        user_id = request.session.get('user')
        sgxUser = SgxUser.objects.get(pk=user_id)
        repository = request.POST['repository']
        user_name = request.session.get('name')
        sourcePath = request.POST['sourcePath']
        dirs = 'files/' + user_name + '/' + repository + sourcePath
        respMsg = ""
        try:
            sgxLklData = SgxLkl.objects.get(imageName=repository, imagePath=dirs)
            respMsg = "fileFound"
        except SgxLkl.DoesNotExist :
            respMsg = "fileNotFound"

        return HttpResponse(respMsg)



def makeLKLImages(request):
    imageName = request.POST['fullImageName']
    dockerName = request.POST['dockerName']
    imageSize = request.POST['size']

    user_name = request.session.get('name')
    sourcePath = request.POST['sourcePath']
    dirs = 'files/' + user_name + '/'+ dockerName +  sourcePath

    try:
        if not (os.path.isdir(dirs)):
            # Make repository path folder
            os.makedirs(os.path.join(dirs))

    except OSError as e:
        if e.errno != errno.EEXIST:
            print("Failed to create directory!")
            raise

    try:
        sudoPassword = 'classact!'
        command1 = "PATH=$PATH:/opt/sgx-lkl/bin"
        os.system('echo %s|sudo -S %s' % (sudoPassword, command1))
        command2 = "/opt/sgx-lkl/bin/sgx-lkl-setup"
        os.system('echo %s|sudo -S %s' % (sudoPassword, command2))
        command3 = "/opt/sgx-lkl/bin/sgx-lkl-disk create --docker="+dockerName+" --size="+imageSize+"M "+dirs+imageName+".img"
        print(command3)
        os.system('echo %s|sudo -S %s' % (sudoPassword, command3))

    except Exception as ex:
        print('에러가 발생 했습니다', ex)
        return False

    return dirs


def execution(request):
    user = request.session.get('user')
    name = request.session.get('name')
    email = request.session.get('email')
    sessionDic = {'user': user, 'name': name, 'email': email}

    category = request.POST.get('category', None)
    imageName = request.POST.get('imageName', None)

    selectImage = {'category':category, 'imageName':imageName}
    print(selectImage)

    lklList = SgxLkl.objects.select_related('dockerId').filter(registeredUser_id=user)
    context = {'lklList': lklList, 'jsUrl': 'lkl/execution.js'}

    context.update(sessionDic)
    context.update(selectImage)
    return render(request, 'execution.html', context)


def deleteImage(request):

    # deleteFile
    user = request.session.get('user')
    req_del_id = request.POST.get('chk[]')
    lklDeleteImage = SgxLkl.objects.filter(registeredUser_id=user, id=req_del_id)

    # deleteDB
    if deleteFile(lklDeleteImage):
        lklDeleteImage.delete()
        return HttpResponse("delete success %s." % lklDeleteImage)
    else:
        return HttpResponse("delete Fail %s." % lklDeleteImage)


def deleteFile(lklDeleteImage):
    pathDir = lklDeleteImage[0].imagePath
    pathFile = lklDeleteImage[0].imageName
    fullPath = os.path.join(pathDir+pathFile+".img")

    try:
        if os.path.isfile(fullPath):
            os.remove(fullPath)

        if os.path.isfile(fullPath + ".docker"):
            os.remove(fullPath+".docker")

        if os.path.isfile(fullPath + ".docker_entrypoint"):
            os.remove(fullPath + ".docker_entrypoint")
    except OSError:
        print(OSError.strerror)
        return False

    return True


def executionDetail(request):
    user = request.session.get('user')
    name = request.session.get('name')
    email = request.session.get('email')
    sessionDic = {'user': user, 'name': name, 'email': email}

    category = request.POST.get('category')
    print(category)

    imageName = request.POST.get('imageName')
    print(imageName)

    context = {'imageName':imageName, 'jsUrl': 'lkl/executionDetail.js'}
    context.update(sessionDic)

    return render(request, 'executionDetail.html', context)

