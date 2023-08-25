from django.shortcuts import render
from .models import *
# Create your views here.

def index(request):
    latestNews = LatestNews.objects.order_by("-sno")
    exam = Exam.objects.all()
    particularExamReources = {}

    # particularExamReources = ResourcesByExam.objects.order_by("-sno")[:6]
    # for exam in exam:
    #     particularExamReources[exam] = ResourcesByExam.objects.filter(exam_Name=exam).order_by("-sno")[:6]
    print(exam)


    context={'latestNews': latestNews, 'Exam':exam, 'ExamReources': particularExamReources}


    return render(request,"index.html", context=context)