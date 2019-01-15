# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2019-01-11 23:40
from __future__ import unicode_literals

import django.db.models.deletion
import jsonfield.fields
from django.conf import settings
from django.db import migrations
from django.db import models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PingbackNotification',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('version_range', models.CharField(max_length=50)),
                ('timestamp', models.DateField(max_length=50)),
                ('link_url', models.CharField(blank=True, max_length=50)),
                ('i18n', jsonfield.fields.JSONField(default={})),
            ],
        ),
        migrations.CreateModel(
            name='PingbackNotificationDismissed',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notification', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='analytics.PingbackNotification')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
