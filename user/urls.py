from django.urls import path
from . import views
urlpatterns = [
    path('list/', views.getlist),
    path('login/', views.login),
    path('logout/', views.logout),
    path('register/', views.register),
    path('validUser/', views.validUser),
    path('deleteUser/', views.deleteUser),
    path('editUser/', views.editUser)
]