from django.shortcuts import render
from .models import *
# Create your views here.

def index(request):
    latestNews = LatestNews.objects.order_by("-sno")
    exam = Exam.objects.all()
    context={'latestNews': latestNews, 'Exam':exam}


    return render(request,"index.html", context=context)