# Generated by Django 4.1.5 on 2023-08-22 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('baseApp', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='resourcecategory',
            options={'verbose_name': 'Resource Category', 'verbose_name_plural': 'Resource Category'},
        ),
        migrations.AddField(
            model_name='resourcecategory',
            name='imageLink',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='resourcecategory',
            name='link',
            field=models.CharField(blank=True, default='', max_length=255, null=True),
        ),
    ]
