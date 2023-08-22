# Generated by Django 4.1.5 on 2023-08-22 15:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('baseApp', '0002_alter_resourcecategory_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='CategoryResources',
            fields=[
                ('sno', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=130)),
            ],
            options={
                'verbose_name': 'Category',
                'verbose_name_plural': 'Category',
            },
        ),
        migrations.AlterField(
            model_name='resourcecategory',
            name='link',
            field=models.CharField(blank=True, default='', editable=False, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='resourcecategory',
            name='name',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='baseApp.categoryresources'),
        ),
    ]
