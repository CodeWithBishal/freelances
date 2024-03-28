from django.db import models
from django.utils.timezone import now
# Create your models here.
class StoreLastIDs(models.Model):
    sno = models.AutoField(primary_key=True)
    platform = models.CharField(max_length=255)
    lastID = models.CharField(max_length=255, blank=False)
    lastRun = models.DateTimeField(default=now)

class storeData(models.Model):
    sno = models.AutoField(primary_key=True)
    storeTime = models.DateTimeField(default=now)
    #get from views.py
    channelNameYT = models.CharField(max_length=255)
    dataURL = models.CharField(max_length=255)
    publishDateYT = models.DateTimeField(blank=False)
    videoIdYT = models.CharField(max_length=255)
    videoTitleYT = models.CharField(max_length=255)
    viewsYT = models.CharField(max_length=255)
    thumbnailYT = models.CharField(max_length=255)
    platform = models.CharField(max_length=255, blank=False)
