import errno
import os

from django.shortcuts import render, redirect

from user.models import SgxUser
from .models import SgxDocker
from .forms import DockersForm
from django.core.files import File
import docker


# Create your views here.
def getlist(request):
    client = docker.from_env()
    containers = client.containers.list()

    images = client.images.list()

    for image in images:
        for container in containers:
            if container.get('ImageID') == image.get('Id'):
                image.update(State=container.get('State'))

    return render(request, 'docker_list.html', {'dockerList': images})


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
                dockerLog = buildDockerFile(dockerFilePath)

                # dockers.save()

            return redirect('/dockers/list')
    else:
        form = DockersForm()

    return render(request, 'docker_register.html', {'form': form})


def makeDockerFile(request, dockers):
    user_name = request.session.get('name')
    repository = dockers.repository
    dirs = 'files/'+user_name+'/'+repository+'/'

    try:
        if not (os.path.isdir(dirs)):
            os.makedirs(os.path.join(dirs))
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
    print(dockerFilePath)
    print('build start')
    path = os.path.dirname(dockerFilePath)

    client = docker.from_env()
    dockerLog = client.images.build(path=path, dockerfile='Dockerfile')

    print(dockerLog)
    return dockerLog