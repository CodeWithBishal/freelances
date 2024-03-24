from django.urls import path
from joycaHome import views


urlpatterns = [
    path('', views.index, name='home'),
    path('youtube-23-22aa-API-URL', views.youtubeFetchAPI, name="youtubeFetchAPI"),
    path('youtube', views.youtube, name="youtube"),
]