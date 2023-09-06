from django.contrib import admin
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth.models import Group

# Register your models here.
admin.site.register(Exam)
admin.site.register(LatestNews)
admin.site.register(ResourcesByExam)
admin.site.register(ProblemsOfTheWeek)
admin.site.unregister(User)
admin.site.unregister(Group)