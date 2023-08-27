from baseApp import views
from django.urls import path

urlpatterns = [
    path('', views.index, name='home'),
    path('resources/<str:slug>', views.resources, name='resources'),
    path('resources/', views.redirectHome, name='redirectHome'),
]