from django.shortcuts import render


# Create your views here.
def create(request):
    return render(request, 'create.html')


def execution(request):
    return render(request, 'execution.html')