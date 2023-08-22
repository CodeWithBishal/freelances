from django.db import models
from django.urls import reverse

# Create your models here.
class ResourcesCategory(models.Model):
    sno = models.AutoField(primary_key=True)
    name=models.CharField(max_length=130,null=False, blank=False)
    link=models.CharField(max_length=255,null=False, blank=False)
    
    class Meta:
        verbose_name = "Resources Category"
        verbose_name_plural = "Resources Category"

    def __str__(self):
        return self.name
    
class LatestNews(models.Model):
    sno = models.AutoField(primary_key=True)
    news = models.TextField()
    link=models.CharField(max_length=255,null=True, blank=True)

    class Meta:
        verbose_name = "LatestNews"
        verbose_name_plural = "Latest News"

    def __str__(self):
        return self.news

