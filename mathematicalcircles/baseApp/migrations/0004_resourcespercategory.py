# Generated by Django 4.1.5 on 2023-08-22 15:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('baseApp', '0003_categoryresources_alter_resourcecategory_link_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ResourcesPerCategory',
            fields=[
                ('sno', models.AutoField(primary_key=True, serialize=False)),
                ('resourceThumbnail', models.CharField(blank=True, max_length=255, null=True)),
                ('resourceSummary', models.CharField(blank=True, max_length=255, null=True)),
                ('resourceLink', models.CharField(blank=True, max_length=255, null=True)),
                ('name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='baseApp.categoryresources')),
            ],
            options={
                'verbose_name': 'Resources Per Category',
                'verbose_name_plural': 'Resources Per Category',
            },
        ),
    ]
