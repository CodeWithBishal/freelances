# Generated by Django 4.1.5 on 2023-08-22 12:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('baseApp', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ExamResources',
            new_name='ResourcesCategory',
        ),
        migrations.AlterModelOptions(
            name='resourcescategory',
            options={'verbose_name': 'Resources Category', 'verbose_name_plural': 'Resources Category'},
        ),
    ]
