# Generated by Django 4.2.10 on 2024-10-07 19:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0011_task_end_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Completed', 'Completed'), ('Deleted', 'Deleted')], default='Pending', max_length=20),
        ),
    ]
