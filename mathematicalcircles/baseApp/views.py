from django.shortcuts import render
from .models import *
# Create your views here.

def index(request):
    latestNews = LatestNews.objects.order_by("-sno")
    resourceCategory = ResourceCategory.objects.all()
    context={'latestNews': latestNews, 'resourceCategory':resourceCategory}
    return render(request,"index.html", context=context)