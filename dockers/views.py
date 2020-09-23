import errno
import os
import shutil

from django.shortcuts import render, redirect
from django.http import HttpResponse
from user.models import SgxUser
from .models import SgxDocker


from .forms import DockersForm
from django.core.files import File
import docker


# Create your views here.
def getlist(request):

    # client = docker.from_env()
    # containers = client.containers.list()
    #
    # images = client.images.list()
    #
    # for image in images:
    #     for container in containers:
    #         stateArr = container.attrs.get('State')
    #         print(image.attrs.get('Id'))
    #         if container.attrs.get('Image') == image.attrs.get('Id'):
    #             image.attrs.update(Status=stateArr.get('Status'))

    user_id = request.session.get('user')
    dockerList = SgxDocker.objects.filter(registered_user_id=user_id)
    context = {'dockerList': dockerList, 'jsUrl': 'dockers/docker_list.js'}

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
            dockers.filePath = form.cleaned_data['filePath']
            dockers.dockerfile = form.cleaned_data['dockerfile']
            dockers.registered_user = sgxUser

            # make Docker File
            dockerFilePath = makeDockerFile(request, dockers)

            if dockerFilePath:
                print(dockerFilePath)

                # docker build
                # dockerLog = buildDockerFile(dockerFilePath)

                dockers.save()

                return redirect('/dockers/list')
    else:
        form = DockersForm()

    return render(request, 'docker_register.html', {'form': form, 'jsUrl': 'dockers/docker_register.js'})


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

    return filepath


def buildDockerFile(dockerFilePath):
    path = os.path.dirname(dockerFilePath)

    client = docker.from_env()
    dockerLog = client.images.build(path=path, dockerfile='Dockerfile')

    for logs in dockerLog:
        print(logs)

    return dockerLog


def delete(request):
    if not request.session.get('user'):
        return redirect('/user/login/')

    user_id = request.session.get('user')
    user_name = request.session.get('name')
    req_del_id = request.POST.getlist('chk[]')

    for del_id in req_del_id:
        instance = SgxDocker.objects.get(registered_user_id=user_id, id=del_id)
        instance.delete()

        repo_name = instance.repository
        dirs = 'files/' + user_name + '/' + repo_name + '/'
        shutil.rmtree(dirs)

    return HttpResponse("delete success %s." % instance)