# Generated by Django 5.0.3 on 2024-03-28 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('joycaHome', '0007_storedata_delete_storeytdata'),
    ]

    operations = [
        migrations.AddField(
            model_name='storedata',
            name='channelNameYT',
            field=models.CharField(default=None, max_length=255),
            preserve_default=False,
        ),
    ]
