# Generated by Django 5.1.5 on 2025-03-08 10:13

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aerolamp_api', '0002_remove_esp32device_user_esp32device_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='airqualitydata',
            name='timestamp',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
