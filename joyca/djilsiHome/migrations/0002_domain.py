# Generated by Django 5.0.3 on 2024-05-07 08:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('djilsiHome', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='domain',
            fields=[
                ('sno', models.AutoField(primary_key=True, serialize=False)),
                ('domain', models.TextField()),
            ],
        ),
    ]
