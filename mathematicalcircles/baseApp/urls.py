from baseApp import views
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='home'),
    path('resources/<str:slug>', views.resources, name='resources'),
    path('resources/', views.redirectHome, name='redirectHome'),
    path('problem-of-the-week/', views.potw, name='potw'),
]

if settings.DEBUG:
    #urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)