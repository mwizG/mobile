# Generated by Django 5.0.2 on 2024-08-29 12:37

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('emergency_services', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='emergencyservice',
            name='user',
        ),
        migrations.AddField(
            model_name='emergencyservice',
            name='location',
            field=models.CharField(default=3344, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='emergencyservice',
            name='requested_by',
            field=models.ForeignKey(default=3355, on_delete=django.db.models.deletion.CASCADE, related_name='emergency_requests', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='emergencyservice',
            name='status',
            field=models.CharField(default='Pending', max_length=50),
        ),
        migrations.AlterField(
            model_name='emergencyservice',
            name='service_type',
            field=models.CharField(choices=[('ambulance', 'Ambulance'), ('fire', 'Fire'), ('police', 'Police'), ('other', 'Other')], max_length=50),
        ),
    ]
