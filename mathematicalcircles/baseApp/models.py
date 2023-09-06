from django.db import models

# Create your models here.
class Exam(models.Model):
    sno = models.AutoField(primary_key=True)
    exam_Name=models.CharField(max_length=130,null=False, blank=False)
    #image_Link=models.CharField(max_length=255,null=False, blank=False)
    image_Link=models.ImageField(upload_to="static/uploaded-images")
    link=models.CharField(max_length=255, default='',null=True, blank=True, editable=False)

    class Meta:
        verbose_name = "Exam"
        verbose_name_plural = "Exam"

    def __str__(self):
        return str(self.exam_Name)
    
    def save(self, *args, **kwargs):
        if not self.link:
            self.link = str(self.exam_Name).lower().replace(" ", "-")
        super().save(*args, **kwargs)
    
class LatestNews(models.Model):
    sno = models.AutoField(primary_key=True)
    news = models.TextField()
    link=models.CharField(max_length=255,null=True, blank=True)

    class Meta:
        verbose_name = "LatestNews"
        verbose_name_plural = "Latest News"

    def __str__(self):
        return self.news
    
class ResourcesByExam(models.Model):
    sno = models.AutoField(primary_key=True)
    exam_Name = models.ForeignKey(Exam, on_delete=models.CASCADE)
    resource_Name=models.CharField(max_length=255,null=False, blank=False)
    #resource_Thumbnail=models.CharField(max_length=255,null=False, blank=False)
    resource_Thumbnail=models.ImageField(upload_to="static/resource-thumbnail")
    #resource_Summary=models.TextField()
    resource_Link=models.CharField(max_length=255,null=False, blank=False)

    class Meta:
        verbose_name = "Resources By Exam"
        verbose_name_plural = "Resources By Exam"

    def __str__(self):
        return self.resource_Name+" -- "+str(self.exam_Name)
    
class ProblemsOfTheWeek(models.Model):
    sno = models.AutoField(primary_key=True)
    name=models.CharField(max_length=255,null=False, blank=False)
    questionLink=models.CharField(max_length=255,null=False, blank=False)
    answerLink=models.CharField(max_length=255,null=True, blank=True)
    resource_Thumbnail=models.ImageField(upload_to="static/potw")


    class Meta:
        verbose_name = "Problem Of The Week"
        verbose_name_plural = "Problem Of The Week"

    def __str__(self):
        return self.name

class ProblemsOfTheWeekAnnouncement(models.Model):
    sno = models.AutoField(primary_key=True)
    announcement = models.TextField()
    link=models.CharField(max_length=255,null=True, blank=True)

    class Meta:
        verbose_name = "Problem Of The Week Announcement"
        verbose_name_plural = "Problem Of The Week Announcement"

    def __str__(self):
        return self.announcement

