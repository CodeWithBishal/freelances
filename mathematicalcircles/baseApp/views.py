from django.shortcuts import render, redirect
from .models import *
# Create your views here.

def index(request):
    latestNews = LatestNews.objects.order_by("-sno")
    exam = Exam.objects.all()
    problemsoftheweek = ProblemsOfTheWeek.objects.order_by("-sno")[:6]
    if ProblemsOfTheWeekAnnouncement.objects.count() != 0:
        problemsOfTheWeekAnnouncement = ProblemsOfTheWeekAnnouncement.objects.order_by("-sno")
    else:
        problemsOfTheWeekAnnouncement=False
    context={'latestNews': latestNews, 'Exam':exam, 'problemsoftheweek':problemsoftheweek,'problemsOfTheWeekAnnouncement':problemsOfTheWeekAnnouncement}
    return render(request,"index.html", context=context)

def resources(request, slug):
    latestNews = LatestNews.objects.order_by("-sno")
    exam = Exam.objects.get(link=slug)
    resourcesByExam = ResourcesByExam.objects.filter(exam_Name=exam)
    if ProblemsOfTheWeekAnnouncement.objects.count() != 0:
        problemsOfTheWeekAnnouncement = ProblemsOfTheWeekAnnouncement.objects.order_by("-sno")
    else:
        problemsOfTheWeekAnnouncement=False
    if resourcesByExam:
        eName = resourcesByExam[0].exam_Name
    else:
        context={'latestNews': latestNews, 'problemsOfTheWeekAnnouncement':problemsOfTheWeekAnnouncement}
        return render(request, "resources.html", context=context)
    context={"resourcesByExam":resourcesByExam, 'eName':eName, 'latestNews': latestNews, 'problemsOfTheWeekAnnouncement':problemsOfTheWeekAnnouncement}
    return render(request, "resources.html", context=context)

def redirectHome(context):
    return redirect('/')

def potw(request):
    latestNews = LatestNews.objects.order_by("-sno")
    eName = "Problem of The Week"
    problemsoftheweek = ProblemsOfTheWeek.objects.order_by("-sno")
    if ProblemsOfTheWeekAnnouncement.objects.count() != 0:
        problemsOfTheWeekAnnouncement = ProblemsOfTheWeekAnnouncement.objects.order_by("-sno")
        context={"resourcesByExam":False, 'eName':eName, 'latestNews': latestNews,'problemsoftheweek':problemsoftheweek, 'problemsOfTheWeekAnnouncement':problemsOfTheWeekAnnouncement}
    else:
        context={"resourcesByExam":False, 'eName':eName, 'latestNews': latestNews,'problemsoftheweek':problemsoftheweek, 'problemsOfTheWeekAnnouncement':False}
    return render(request,"resources.html", context=context)