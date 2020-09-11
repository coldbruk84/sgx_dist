from django.shortcuts import render


# Create your views here.
def getlist(request):
    return render(request, 'user_list.html')


def login(request):
    return render(request, 'login.html')


def register(request):
    return render(request, 'user_register.html')
