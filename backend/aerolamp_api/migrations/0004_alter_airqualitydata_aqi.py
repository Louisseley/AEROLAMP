# Generated by Django 5.1.5 on 2025-03-08 10:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aerolamp_api', '0003_alter_airqualitydata_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='airqualitydata',
            name='aqi',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
