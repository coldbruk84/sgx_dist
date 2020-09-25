from django.shortcuts import render
from dockers.models import SgxDocker

# Create your views here.
def create(request):
    user_id = request.session.get('user')
    dockerList = SgxDocker.objects.filter(registered_user_id=user_id)
    context = {'dockerList': dockerList, 'jsUrl': 'lkl/lkl_create.js'}
    return render(request, 'lkl_create.html', context)


def execution(request):
    return render(request, 'execution.html')


def execution2(request):
    return render(request, 'execution2.html')

