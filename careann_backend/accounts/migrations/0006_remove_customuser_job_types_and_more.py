# Generated by Django 4.2.10 on 2024-09-28 18:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_customuser_job_types'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='job_types',
        ),
        migrations.AlterField(
            model_name='customuser',
            name='experience_categories',
            field=models.CharField(blank=True, choices=[('Respite Care', 'Respite Care'), ('Home Care', 'Home Care'), ('Senior Care', 'Senior Care'), ('Child Care', 'Child Care'), ('Disability Care', 'Disability Care'), ('Palliative Care', 'Palliative Care'), ('Post-Surgical Care', 'Post-Surgical Care'), ('Maternity Care', 'Maternity Care'), ('Dementia Care', 'Dementia Care')], max_length=255, null=True),
        ),
    ]
