# Generated by Django 5.0.3 on 2024-04-13 18:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('joycaHome', '0020_alter_storedata_medialinks'),
    ]

    operations = [
        migrations.AddField(
            model_name='storedata',
            name='mediaURL',
            field=models.TextField(default='1'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='storedata',
            name='twitterThumbnailURL',
            field=models.TextField(default='1'),
            preserve_default=False,
        ),
    ]
