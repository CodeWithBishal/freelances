from django.db import models
from django.utils.timezone import now

class MediaLinks(models.Model):
    mediaURL = models.TextField()

# Create your models here.
class StoreLastIDs(models.Model):
    sno = models.AutoField(primary_key=True)
    platform = models.CharField(max_length=255)
    lastID = models.CharField(max_length=255, blank=False)
    lastRun = models.DateTimeField(default=now)

class storeData(models.Model):
    sno = models.AutoField(primary_key=True)
    storeTime = models.DateTimeField(default=now)
    # common for all 
    publishDateYT = models.DateTimeField(blank=False)
    platform = models.CharField(max_length=255, blank=False)
    #get from views.py
    channelNameYT = models.CharField(max_length=255)
    dataURL = models.CharField(max_length=255)
    videoIdYT = models.CharField(max_length=255)
    videoTitleYT = models.CharField(max_length=255)
    viewsYT = models.CharField(max_length=255)
    thumbnailYT = models.CharField(max_length=255)
    # InstaData
    instaThumbnailURL = models.TextField()
    instaIsVideo = models.CharField(max_length=255)
    instaVideoURL = models.TextField(blank=True,null=True)
    instaDesc = models.TextField()
    instaPostLink = models.TextField()
    instaLikes = models.TextField()
    instaPostID = models.CharField(max_length=255)
    instaIsSingle = models.CharField(max_length=255)
    instaMediaLinks = models.JSONField(blank=True, null=True)

    #Twitter
    tweetText = models.TextField()
    twitterLikes = models.CharField(max_length=255)
    tweetLink = models.TextField()
    twitterIsVideo = models.CharField(max_length=255)
    twitterMediaURL = models.TextField()
    twitterPostID = models.CharField(max_length=255)
    def __str__(self):
        return f"{self.sno} - {self.platform}"

class bannerYT(models.Model):
    sno = models.AutoField(primary_key=True)
    storeTime = models.DateTimeField(default=now)
    # common for all
    dataURL = models.TextField()
    dpURL = models.TextField()
    subsCount = models.CharField(max_length=255)
    ytHandle = models.CharField(max_length=255)
    ytLink = models.TextField()

class dpInsta(models.Model):
    sno = models.AutoField(primary_key=True)
    storeTime = models.DateTimeField(default=now)
    # common for all
    dataURL = models.TextField()
    dpURL = models.TextField()
    followerCount = models.CharField(max_length=255)
    instaHandle = models.CharField(max_length=255)
    instaLink = models.TextField()

class twitterDP(models.Model):
    sno = models.AutoField(primary_key=True)
    storeTime = models.DateTimeField(default=now)
    # common for all
    dataURL = models.TextField()
    dpURL = models.TextField()
    followerCount = models.CharField(max_length=255)
    twitterHandle = models.CharField(max_length=255)
    twitterLink = models.TextField()

class instagramAccessToken(models.Model):
    sno = models.AutoField(primary_key=True)
    accessToken = models.TextField()

class domain(models.Model):
    sno = models.AutoField(primary_key=True)
    domain = models.TextField() 