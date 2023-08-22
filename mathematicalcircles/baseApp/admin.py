from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(ResourceCategory)
admin.site.register(LatestNews)
admin.site.register(CategoryResources)
admin.site.register(ResourcesByCategory)