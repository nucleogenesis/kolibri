# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-04-16 13:09
from __future__ import unicode_literals

import django.db.models.deletion
import jsonfield.fields
from django.db import migrations
from django.db import models

import kolibri.core.content.models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0016_auto_20190124_1639'),
    ]

    operations = [
        migrations.CreateModel(
            name='SlideshowMetaData',
            fields=[
                ('id', kolibri.core.content.models.UUIDField(primary_key=True, serialize=False)),
                ('sort_order', models.IntegerField(default=None)),
                ('metadata', jsonfield.fields.JSONField(default={})),
                ('contentnode', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='slideshowmetadata', to='content.ContentNode')),
            ],
        ),
    ]
