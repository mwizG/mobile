# Generated by Django 4.2.10 on 2024-09-28 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_remove_customuser_experience'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExperienceCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('Respite Care', 'Respite Care'), ('Home Care', 'Home Care'), ('Senior Care', 'Senior Care'), ('Child Care', 'Child Care'), ('Disability Care', 'Disability Care'), ('Palliative Care', 'Palliative Care'), ('Post-Surgical Care', 'Post-Surgical Care'), ('Maternity Care', 'Maternity Care'), ('Dementia Care', 'Dementia Care')], max_length=255)),
            ],
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='experience_categories',
        ),
        migrations.AddField(
            model_name='customuser',
            name='experience_categories',
            field=models.ManyToManyField(blank=True, to='accounts.experiencecategory'),
        ),
    ]
