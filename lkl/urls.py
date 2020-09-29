from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.createList),
    path('createLkl/', views.createLkl),
    path('validLkl/', views.validLkl),
    path('execution/', views.execution),
    path('execution2/', views.execution2)
]