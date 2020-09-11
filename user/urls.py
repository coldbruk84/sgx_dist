from django.urls import path
from . import views
urlpatterns = [
    path('list/', views.getlist),
    path('login/', views.login),
    path('register/', views.register)
]