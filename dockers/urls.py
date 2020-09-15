from django.urls import path
from . import views
urlpatterns = [
    path('list/', views.getlist),
    path('register/', views.register)
]