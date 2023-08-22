from django.shortcuts import render
from .models import ResourcesCategory, LatestNews
# Create your views here.

def index(request):
    latestNews = LatestNews.objects.order_by("-sno")
    context={'latestNews': latestNews}
    return render(request,"index.html", context=context)