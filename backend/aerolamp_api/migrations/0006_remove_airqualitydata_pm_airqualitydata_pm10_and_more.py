# Generated by Django 5.1.5 on 2025-03-13 12:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aerolamp_api', '0005_alter_airqualitydata_aqi'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='airqualitydata',
            name='pm',
        ),
        migrations.AddField(
            model_name='airqualitydata',
            name='pm10',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='airqualitydata',
            name='pm25',
            field=models.FloatField(default=0.0),
        ),
    ]
