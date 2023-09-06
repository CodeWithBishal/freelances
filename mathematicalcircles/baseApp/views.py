from django.shortcuts import render, redirect
from .models import *
# Create your views here.

def index(request):
    latestNews = LatestNews.objects.order_by("-sno")
    exam = Exam.objects.all()
    problemsoftheweek = ProblemsOfTheWeek.objects.all()
    context={'latestNews': latestNews, 'Exam':exam, 'problemsoftheweek':problemsoftheweek}


    return render(request,"index.html", context=context)

def resources(request, slug):
    latestNews = LatestNews.objects.order_by("-sno")
    exam = Exam.objects.get(link=slug)
    resourcesByExam = ResourcesByExam.objects.filter(exam_Name=exam)
    if resourcesByExam:
        eName = resourcesByExam[0].exam_Name
    else:
        context={'latestNews': latestNews}
        return render(request, "resources.html", context=context)
    context={"resourcesByExam":resourcesByExam, 'eName':eName, 'latestNews': latestNews}
    return render(request, "resources.html", context=context)

def redirectHome(context):
    return redirect('/')