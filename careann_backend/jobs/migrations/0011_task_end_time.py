# Generated by Django 4.2.10 on 2024-10-07 17:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0010_alter_jobapplication_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='end_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]