# Generated by Django 5.0.3 on 2024-04-11 17:21

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('joycaHome', '0015_dpinsta_followercount'),
    ]

    operations = [
        migrations.CreateModel(
            name='twitterDP',
            fields=[
                ('sno', models.AutoField(primary_key=True, serialize=False)),
                ('storeTime', models.DateTimeField(default=django.utils.timezone.now)),
                ('dataURL', models.TextField()),
                ('followerCount', models.CharField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='storedata',
            name='instaThumbnailURL',
            field=models.TextField(default='1'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='storedata',
            name='isSingle',
            field=models.CharField(default='1', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='storedata',
            name='isVideo',
            field=models.CharField(default='1', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='storedata',
            name='mediaLinks',
            field=models.JSONField(default='1'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='storedata',
            name='postID',
            field=models.CharField(default='1', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='storedata',
            name='videoURL',
            field=models.TextField(default='1'),
            preserve_default=False,
        ),
    ]
