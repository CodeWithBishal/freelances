# Generated by Django 4.1.5 on 2023-08-28 08:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('baseApp', '0018_alter_exam_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='exam',
            name='image_Link',
        ),
        migrations.AlterField(
            model_name='resourcesbyexam',
            name='resource_Thumbnail',
            field=models.ImageField(upload_to='static/resource-thumbnail'),
        ),
    ]
