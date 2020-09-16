from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.create),
    path('execution/', views.execution),
    path('execution2/', views.execution2)
]