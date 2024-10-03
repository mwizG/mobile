# Generated by Django 5.0.2 on 2024-10-03 06:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0008_alter_job_options_alter_job_job_type_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='location',
            field=models.CharField(choices=[('Lusaka', 'Lusaka'), ('Ndola', 'Ndola'), ('Kitwe', 'Kitwe'), ('Livingstone', 'Livingstone'), ('Chipata', 'Chipata'), ('Mansa', 'Mansa'), ('Kabwe', 'Kabwe'), ('Solwezi', 'Solwezi')], default='Lusaka', max_length=50),
        ),
    ]
