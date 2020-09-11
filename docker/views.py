from django.shortcuts import render


# Create your views here.
def getlist(request):
    return render(request, 'list.html')


def register(request):
    return render(request, 'register.html')