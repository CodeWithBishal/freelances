from django.urls import path
from pannacotechHome import views


urlpatterns = [
    path('', views.index, name='home'),
    path('youtube-23-22aa-API-URL', views.youtubeFetchAPI, name="youtubeFetchAPI"),
    path('bannerYT-23-22aa-API-URL', views.fetchBanner, name="bannerYTFetchAPI"),
    path('twitterScape-23-22aa-API-URL', views.twitterScape, name="twitterScape"),
    path('instaScape-23-22aa-API-URL', views.fetchInsta, name="fetchInsta"),
    path('youtube', views.youtube, name="youtube"),
    path('twitter', views.twitter, name="twitter"),
    path('instagram', views.instagram, name="instagram"),
]