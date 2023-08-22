from django.shortcuts import render
from .models import ResourceCategory, LatestNews
# Create your views here.

def index(request):
    latestNews = LatestNews.objects.order_by("-sno")
    # resourceCategory = LatestNews.objects.order_by("-sno")
    context={'latestNews': latestNews}
    return render(request,"index.html", context=context)