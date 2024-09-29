# Generated by Django 4.2.10 on 2024-09-29 05:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_experiencecategory_job_type_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='experience_categories',
        ),
        migrations.AddField(
            model_name='customuser',
            name='experience_cat1',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='category1_users', to='accounts.experiencecategory'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='experience_cat2',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='category2_users', to='accounts.experiencecategory'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='experience_cat3',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='category3_users', to='accounts.experiencecategory'),
        ),
    ]
