# Generated by Django 4.2.10 on 2024-09-28 18:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_customuser_average_rating_customuser_rating_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='job_types',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]