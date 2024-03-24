from django.db import models
from django.utils.timezone import now
# Create your models here.
class StoreLastIDs(models.Model):
    sno = models.AutoField(primary_key=True)
    platform = models.CharField(max_length=255)
    lastID = models.CharField(max_length=255, blank=False)
    lastRun = models.DateTimeField(default=now)

class storeYTData(models.Model):
    sno = models.AutoField(primary_key=True)
    storeTime = models.DateTimeField(default=now)
    #get from views.py
    dataURL = models.CharField(max_length=255, blank=False)
    publishDateYT = models.DateTimeField(blank=False)
    videoIdYT = models.CharField(max_length=255, blank=False)
    videoTitleYT = models.CharField(max_length=255, blank=False)
    viewsYT = models.CharField(max_length=255, blank=False)
    thumbnailYT = models.CharField(max_length=255, blank=False)
    descriptionYT = models.TextField(blank=True)
