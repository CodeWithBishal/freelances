from django.contrib import admin
from .models import ResourceCategory,LatestNews

# Register your models here.
admin.site.register(ResourceCategory)
admin.site.register(LatestNews)