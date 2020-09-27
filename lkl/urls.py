from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.createList),
    path('execution/', views.execution),
    path('execution2/', views.execution2)
]