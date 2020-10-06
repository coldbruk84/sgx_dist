from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.createList),
    path('deleteImage/', views.deleteImage),
    path('createLkl/', views.createLkl),
    path('validLkl/', views.validLkl),
    path('execution/', views.execution),
    path('executionDetail/', views.executionDetail)
]