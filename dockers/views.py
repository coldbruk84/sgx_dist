import errno
import os
import shutil
import json
import docker

from django.shortcuts import render, redirect
from django.http import HttpResponse
from user.models import SgxUser
from .models import SgxDocker
from .forms import DockersForm



# Create your views here.
def getlist(request):

    user = request.session.get('user')
    name = request.session.get('name')
    email = request.session.get('email')
    sessionDic = {'user': user, 'name': name, 'email': email}

    user_id = request.session.get('user')
    dockerList = SgxDocker.objects.filter(registered_user_id=user_id)
    context = { 'dockerList': dockerList, 'jsUrl': 'dockers/docker_list.js'}
    context.update(sessionDic)

    return render(request, 'docker_list.html', context)


def register(request):
    if not request.session.get('user'):
        return redirect('/user/login/')

    if request.method == 'POST':
        form = DockersForm(request.POST)

        if form.is_valid():
            user_id = request.session.get('user')
            sgxUser = SgxUser.objects.get(pk=user_id)

            dockers = SgxDocker()
            dockers.category = form.cleaned_data['category']
            dockers.repository = form.cleaned_data['repository']
            dockers.version = form.cleaned_data['version']
            dockers.tag = form.cleaned_data['tag']
            dockers.sourcePath = form.cleaned_data['sourcePath']
            dockers.filePath = form.cleaned_data['directories']
            dockers.dockerfile = form.cleaned_data['dockerfile']
            dockers.directories = form.cleaned_data['directories']
            dockers.registered_user = sgxUser


            # make Docker File
            dockerFilePath = makeDockerFile(request, dockers)

            if dockerFilePath:

                # docker build
                dockerLog = buildDockerFile(dockerFilePath,dockers)

                if dockerLog:
                    # docker Log ID 를 입력
                    dockerIdStr = dockerLog[0].id.split(':')[1]
                    dockers.imageId = dockerIdStr
                    
                    dockers.save()

                    return redirect('/dockers/list')
    else:
        form = DockersForm()

    user = request.session.get('user')
    name = request.session.get('name')
    email = request.session.get('email')
    sessionDic = {'user': user, 'name': name, 'email': email}

    context = {'form': form, 'jsUrl': 'dockers/docker_register.js'}
    context.update(sessionDic)
    return render(request, 'docker_register.html', context)


def makeDockerFile(request, dockers):
    user_name = request.session.get('name')
    repository = dockers.repository
    sourcePath = dockers.sourcePath
    dirs = 'files/'+user_name+'/'+repository+'/'

    try:
        if not (os.path.isdir(dirs)):
            # Make repository path folder
            os.makedirs(os.path.join(dirs))

            # Make Source path folder
            os.makedirs(os.path.join(dirs+sourcePath))

    except OSError as e:
        if e.errno != errno.EEXIST:
            print("Failed to create directory!")
            raise

    filepath = os.path.join(dirs, "Dockerfile")
    save_text = open(filepath, 'w')
    save_text.write(dockers.dockerfile)
    save_text.close()

    # 소스 파일 업로드
    fileList = dockers.directories
    fileDict = json.loads(fileList)
    fileObj = request.FILES.getlist('filePath[]')

    for fileGet in fileObj:
        upFilePath = dirs+fileDict[fileGet.name]
        handle_uploaded_file(upFilePath,fileGet)

    return filepath


def handle_uploaded_file(upFilePath,fileGet):
    realPath = os.getcwd()+'/'+upFilePath
    spPath = realPath.rsplit('/',1)[0]
    try:
        if not (os.path.isdir(spPath)):
            # Make repository path folder
            os.makedirs(os.path.join(spPath))

    except OSError as e:
        if e.errno != errno.EEXIST:
            print("Failed to create directory!")
            raise

    with open(realPath, 'wb+') as destination:
        for chunk in fileGet.chunks():
            destination.write(chunk)


def buildDockerFile(dockerFilePath, dockers):
    path = os.path.dirname(dockerFilePath)
    repository = dockers.repository
    client = docker.from_env()
    dockerLog = client.images.build(path=path, dockerfile='Dockerfile', tag=repository, rm=True)

    for chunk in dockerLog[1]:
        if 'stream' in chunk:
            for line in chunk['stream'].splitlines():
                print(line)

    client.images.prune(filters=None)
    return dockerLog


def delete(request):
    if not request.session.get('user'):
        return redirect('/user/login/')

    user_id = request.session.get('user')
    user_name = request.session.get('name')
    req_del_id = request.POST.getlist('chk[]')

    for del_id in req_del_id:
        instance = SgxDocker.objects.get(registered_user_id=user_id, id=del_id)
        repo_name = instance.repository
        dirs = 'files/' + user_name + '/' + repo_name + '/'

        try:
            shutil.rmtree(dirs)
        except shutil.Error:
            print('Path Error')
        finally:
            instance.delete()
            deleteDockerImage(instance)




    return HttpResponse("delete success %s." % instance)


def deleteDockerImage(instance):
    repoName = instance.repository+':'+instance.tag

    client = docker.from_env()

    # 도커 컨테이너 STOP
    client.containers.prune()

    # 도커 컨테이너 삭제
    client.containers.prune()

    # 이미지 삭제
    client.images.remove(image=repoName,force=True)
