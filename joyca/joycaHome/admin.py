from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from joycaHome.resources import storeDataAdmin
from .models import *
# Register your models here.
admin.site.register(StoreLastIDs)
# admin.site.register(storeData)
admin.site.register(bannerYT)
admin.site.register(dpInsta)
admin.site.register(twitterDP)
@admin.register(storeData)
class storeData(ImportExportModelAdmin):
    resource_class  =   storeDataAdmin
    list_display = ['sno']
