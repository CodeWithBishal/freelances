from django.db import models

# Create your models here.
class CategoryResources(models.Model):
    sno = models.AutoField(primary_key=True)
    name=models.CharField(max_length=130,null=False, blank=False)

    class Meta:
        verbose_name = "Exam Name"
        verbose_name_plural = "Exam Name"

    def __str__(self):
        return self.name
    
class ResourceCategory(models.Model):
    sno = models.AutoField(primary_key=True)
    exam_Name=models.ForeignKey(CategoryResources, on_delete=models.CASCADE)
    image_Link=models.CharField(max_length=255,null=False, blank=False)
    link=models.CharField(max_length=255, default='',null=True, blank=True, editable=False)

    class Meta:
        verbose_name = "Exam"
        verbose_name_plural = "Exam"

    def __str__(self):
        return str(self.name)
    
    def save(self, *args, **kwargs):
        if not self.link:
            self.link = str(self.name).lower().replace(" ", "-")
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
    
class ResourcesByCategory(models.Model):
    sno = models.AutoField(primary_key=True)
    exam_Name=models.ForeignKey(CategoryResources, on_delete=models.CASCADE)
    resource_Thumbnail=models.CharField(max_length=255,null=True, blank=True)
    resource_Summary=models.TextField()
    resource_Link=models.CharField(max_length=255,null=True, blank=True)

    class Meta:
        verbose_name = "Resources By Exam"
        verbose_name_plural = "Resources By Exam"

    def __str__(self):
        return self.name

