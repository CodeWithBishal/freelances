# Generated by Django 5.0.3 on 2024-04-21 13:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('joycaHome', '0032_alter_storedata_instavideourl'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='storedata',
            name='twitterPostID',
        ),
        migrations.RemoveField(
            model_name='storedata',
            name='twitterThumbnailURL',
        ),
    ]
